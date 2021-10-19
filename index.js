#!/usr/bin/env node

// ytcog-dl - CLI for ytcog innertube library
// (c) 2021 gatecrasher777
// https://github.com/gatecrasher777/ytcog-dl
// MIT Licenced

const ytcog = require('ytcog');
const fs = require('fs');

class Command {
	constructor() {
		this.session = null;
		this.object = 'search';
		this.action = 'batch';
		this.id = [];
		this.cookie = '';
		this.agent = '';
		this.repeat = -1;
		this.concurrent = 10;
		this.maxdl = -1;
		this.saveFilename = '';
		this.savePath = '.';
		this.save = 'all';
		this.exclusions = ['cookie', 'userAgent', 'options', 'sapisid', 'status', 'reason',
			'cancelled', 'formats', 'debugOn', 'transferred', 'profiled'];
		this.options = {};
		this.video = {};
		this.channel = {};
		this.playlist = {};
		this.search = null;
		this.ambigiuity = ['--userAgent', '--overwrite', '--container'];
	}

	async video_info(id) {
		if (!this.video[id].updated) await this.video[id].fetch();
		if (this.video[id].status === 'OK') {
			let target = `${this.savePath}/`;
			target += this.saveFilename.length ?
				this.video[id].filename(this.saveFilename) :
				this.video[id].filename('${author}_${datetime}_${title}_${id}');
			if (['all', 'info'].includes(this.save)) {
				console.log(`\nVideo info saved to ${target}_info.json`);
				let output = this.video[id].info(this.exclusions);
				fs.writeFileSync(`${target}_info.json`, this.jsp(output), 'utf8');
			}
			if (['all', 'raw'].includes(this.save)) {
				console.log(`Raw video json saved to ${target}_info_raw.json`);
				fs.writeFileSync(`${target}_info_raw.json`, this.jsp(this.video[id].data), 'utf8');
			}
		} else {
			console.log(`Video ${id} failed to get data`);
			console.log(`Status: ${this.video[id].status} (${this.video[id].reason})`);
		}
	}

	async video_streamInfo(id) {
		await this.video_info(id);
		console.log('\nAvailable media streams:');
		console.log(this.video[id].streamInfo);
	}

	async video_download(id) {
		await this.video_info(id);
		let downloaded = 0;
		let lastpc = 0;
		let start = Date.now();
		let mb = 0;
		await this.video[id].download({
			progress: (prg, siz) => {
				let now = Date.now();
				if (!isNaN(siz)) downloaded += siz;
				let donepc = prg.toFixed(1);
				mb = (downloaded / 1024 / 1024).toFixed(1);
				let mbs = (mb * 1000 / (now - start)).toFixed(3);
				if (donepc !== lastpc) process.stdout.write(`Downloading... ${donepc}% ${mb}MB @ ${mbs}MB/s       \r`);
				lastpc = donepc;
			},
		});
		console.log('\nDownloaded Media saved to:');
		console.log(this.video[id].fn);
	}

	async batch_download() {
		let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
		let downloads = [];
		let totdl = 0;
		let start = Date.now();
		let downloaded = 0;
		let completed = 0;
		let inprogress = 0;
		let incomplete = 0;
		let donepc = '0.0';
		let lastpc = '0.0';
		let mb = '0.0';
		let mbs = '0.000';
		let dl = vid => new Promise( async (resolve, reject) => {
			let go = false;
			do {
				if (inprogress < this.concurrent) {
					inprogress++;
					go = true;
					this.options.id = vid.id;
					if (!vid.updated) await vid.fetch(this.options);
					if (vid.status === 'OK') {
						let lastprg = 0;
						await vid.download({
							progress: (prg, siz) => {
								let now = Date.now();
								if (!isNaN(siz)) downloaded += siz;
								incomplete += prg - lastprg;
								lastprg = prg;
								donepc = (100 * ((completed * 100) + incomplete) / (100 * totdl)).toFixed(1);
								mb = (downloaded / 1024 / 1024).toFixed(1);
								mbs = (mb * 1000 / (now - start)).toFixed(3);
								if (donepc !== lastpc) {
									process.stdout.write(
										`Batch download: ${completed}/${totdl} files (${donepc}%) ${mb}MB @ ${mbs}MB/s       \r`);
								}
								lastpc = donepc;
							},
						});
						if (vid.status === 'OK') {
							completed++;
							inprogress--;
							incomplete -= 100;
							resolve(`Downloaded: ${vid.fn}`);
						} else {
							completed++;
							inprogress--;
							reject(Error(`Status: ${vid.status} (${vid.reason}) for ${vid.id}`));
						}
					} else {
						completed++;
						inprogress--;
						reject(Error(`Status: ${vid.status} (${vid.reason}) for ${vid.id}`));
					}
				} else {
					await sleep(3000);
				}
			} while (!go);
		});
		Object.values(this.video).forEach(vid => {
			if ((totdl < this.maxdl) || (this.maxdl < 0)) {
				let download = dl(vid);
				downloads.push(download);
				totdl++;
			}
		});
		let results = await Promise.allSettled(downloads);
		process.stdout.write(`Batch download: ${completed}/${totdl} files (100%) ${mb}MB @ ${mbs} MB/s       \r`);
		console.log('\n');
		results.forEach(r => {
			if (r.status === 'fulfilled') console.log(r.value);
		});
	}

	channel_info() {
		let output = this.channel.info(this.exclusions);
		if (this.channel.status === 'OK') {
			let target = `${this.savePath}/`;
			target += this.saveFilename.length ?
				this.channel.filename(this.saveFilename) :
				this.channel.filename('${author}_${id}_${datetime}_channel');
			if (['all', 'info'].includes(this.save)) {
				console.log(`\nChannel info saved to ${target}_info.json`);
				fs.writeFileSync(`${target}_info.json`, this.jsp(output), 'utf8');
			}
			if (['all', 'raw'].includes(this.save)) {
				console.log(`Raw channel json saved to ${target}_info_raw.json`);
				fs.writeFileSync(`${target}_info_raw.json`, this.jsp(this.channel.data), 'utf8');
			}
		}
	}

	async channel_result() {
		this.channel_info();
		await this.channel.fetch();
		if (this.channel.status === 'OK') {
			let target = `${this.savePath}/`;
			target += this.saveFilename.length ?
				this.channel.filename(this.saveFilename) :
				this.channel.filename('${author}_${id}_${datetime}_${order}_channel');
			let results = [];
			this.channel.results.forEach(item => {
				results.push(item.info(this.exclusions));
			});
			if (['all', 'info'].includes(this.save)) {
				console.log(`\nChannel results saved to ${target}_results.json`);
				fs.writeFileSync(`${target}_results.json`, this.jsp(results), 'utf8');
			}
			if (['all', 'raw'].includes(this.save)) {
				console.log(`Raw channel json saved to ${target}_results_raw.json`);
				fs.writeFileSync(`${target}_results_raw.json`, this.jsp(this.channel.data), 'utf8');
			}
		}
	}

	async channel_download() {
		await this.channel_result();
		this.video = this.channel.videos;
		await this.batch_download();
	}

	playlist_info() {
		let output = this.playlist.info(this.exclusions);
		if (this.playlist.status === 'OK') {
			let target = `${this.savePath}/`;
			target += this.saveFilename.length ?
				this.playlist.filename(this.saveFilename) :
				this.playlist.filename('${compiler}_${title}_${id}_${datetime}_playlist');
			if (['all', 'info'].includes(this.save)) {
				console.log(`\nPlaylist info saved to ${target}_info.json`);
				fs.writeFileSync(`${target}_info.json`, this.jsp(output), 'utf8');
			}
			if (['all', 'raw'].includes(this.save)) {
				console.log(`Raw playlist json saved to ${target}_info_raw.json`);
				fs.writeFileSync(`${target}_info_raw.json`, this.jsp(this.playlist.data), 'utf8');
			}
		}
	}

	playlist_result() {
		this.playlist_info();
		if (this.playlist.status === 'OK') {
			let target = `${this.savePath}/`;
			target += this.saveFilename.length ?
				this.playlist.filename(this.saveFilename) :
				this.playlist.filename('${compiler}_${title}_${id}_${datetime}_playlist');
			let results = [];
			this.playlist.results.forEach(item => {
				results.push(item.info(this.exclusions));
			});
			if (['all', 'info'].includes(this.save)) {
				console.log(`\nPlaylist results saved to ${target}_results.json`);
				fs.writeFileSync(`${target}_results.json`, this.jsp(results), 'utf8');
			}
			if (['all', 'raw'].includes(this.save)) {
				console.log(`Raw playlist json saved to ${target}_results_raw.json`);
				fs.writeFileSync(`${target}_results_raw.json`, this.jsp(this.playlist.data), 'utf8');
			}
		}
	}

	async playlist_download() {
		this.playlist_result();
		this.video = this.playlist.videos;
		await this.batch_download();
	}

	search_result() {
		if (this.search.status === 'OK') {
			let target = `${this.savePath}/`;
			target += this.saveFilename.length ?
				this.search.filename(this.saveFilename) :
				this.search.filename('${query}_${datetime}_${order}_${period}_search');
			let results = [];
			this.search.results.forEach(item => {
				results.push(item.info(this.exclusions));
			});
			console.log(`\nSearch results saved to ${target}_results.json`);
			fs.writeFileSync(`${target}_results.json`, this.jsp(results), 'utf8');
			console.log(`Search data saved to ${target}_results_raw.json`);
			fs.writeFileSync(`${target}_results_raw.json`, this.jsp(this.search.data), 'utf8');
		}
	}

	async search_download() {
		this.search_result();
		this.video = this.search.videos;
		await this.batch_download();
	}

	jsp(o) {
		try {
			return JSON.stringify(o, null, 2);
		} catch (e) {
			return '{}';
		}
	}

	pinch(body, start, end, snip, enip, empty, truncate) {
		let extract = empty;
		let spos = body.indexOf(start);
		let slen = start.length;
		if (spos >= 0) {
			let next = body.substr(spos + slen - snip);
			let epos = next.indexOf(end);
			if (epos >= 0) {
				extract = next.substr(0, epos + enip);
				if (truncate) body = body.substr(spos + slen - snip + epos + enip);
			} else {
				extract = body.substr(spos + slen - snip);
				if (truncate) body = '';
			}
		} else if (truncate) { body = ''; }
		return extract;
	}

	parseId(id) {
		if ((id.length === 11) && !this.ambigiuity.includes(id) && !['channel', 'playlist'].includes(this.object)) {
			this.object = 'video';
			return id;
		} else if ((id.length === 24) && (id.substr(0, 2) === 'UC') && !['video', 'playlist'].includes(this.object)) {
			this.object = 'channel';
			return id;
		} else if ((id.length === 34) && (id.substr(0, 2) === 'PL') && !['video', 'channel'].includes(this.object)) {
			this.object = 'playlist';
			return id;
		} else {
			// is it an url
			try {
				let url = new URL(id);
				let v = url.searchParams.get('v');
				let list = url.searchParams.get('list');
				if (v && v.length === 11 && !['channel', 'playlist'].includes(this.object)) {
					this.object = 'video';
					return v;
				} else if (list && list.length === 34 && list.substr(0, 2) === 'PL' &&
					!['video', 'channel'].includes(this.object)) {
					this.object = 'playlist';
					return list;
				} else {
					let cid = this.pinch(id, 'channel/', '/', 0, 0, '', false);
					if (cid.length === 24 && cid.substr(0, 2) === 'UC' && !['video', 'playlist'].includes(this.object)) {
						this.object = 'channel';
						return cid;
					}
				}
			} catch (e) {
				// it's not an id
			}
		}
		return '';
	}

	async run() {
		try {
			let c = 1;
			let aa = true;
			let ai = true;
			let ao = true;
			const getAction = action => {
				if (aa) {
					this.action = action;
					aa = false;
				} else {
					console.log(`${this.current} ignored - must be the first parameter.`);
				}
			};
			const nextString = () => {
				c++;
				return process.argv[c];
			};
			const getStringOption = option => {
				if (ao) {
					if (['cookie', 'userAgent', 'saveFilename', 'savePath'].includes(option)) {
						app[option] = nextString();
					} else {
						this.options[option] = nextString();
					}
					aa = ai = false;
				} else {
					console.log(`${this.current} ignored - no further options allowed.`);
				}
			};
			const nextNumber = (strict = true) => {
				c++;
				const n = parseInt(process.argv[c]);
				if (isNaN(n)) {
					if (strict) {
						throw Error(`Invalid number argument for ${this.current}`);
					} else {
						c--;
						return -1;
					}
				} else {
					return n;
				}
			};
			const getNumberOption = option => {
				if (ao) {
					option === 'repeat' ? this.repeat = nextNumber() : this.options[option] = nextNumber();
					aa = ai = false;
				} else {
					console.log(`${this.current} ignored - no further options allowed.`);
				}
			};
			const nextOption = (valid, strict = true) => {
				c++;
				const s = process.argv[c];
				if (valid.includes(s)) {
					return s;
				} else if (strict) {
					throw Error(`Invalid option ${s} for ${this.current}. Must be one of ${valid.join(', ')}`);
				} else {
					c--;
					return '';
				}
			};
			const getWordOption = (option, words) => {
				if (ao) {
					option === 'save' ? this.save = nextOption(words) : this.options[option] = nextOption(words);
					aa = ai = false;
				} else {
					console.log(`${this.current} ignored - no further options allowed.`);
				}
			};
			const getMetadata = () => {
				if (ao) {
					let m = nextOption(['author', 'title', 'date', 'description', 'keywords',
						'comment'], false) || nextString();
					let v = nextString();
					this.options.metadata += this.options.metadata.length ? `,${m}` : m;
					if (v.length) this.options.metadata += `=${v}`;
					aa = ai = false;
				}
			};
			const getLimits = () => {
				if (ao) {
					this.concurrent = Math.min(20, Math.max(1, nextNumber()));
					this.maxdl = nextNumber(false);
					aa = ai = false;
				}
			};
			const getFeatures = () => {
				if (ao) {
					let f = nextOption(['live', '4k', 'hd', 'subtitles', 'cc', '360', 'vr180', '3d',
						'hdr', 'location', 'purchased']);
					this.options.features += this.options.features.length ? `,${f}` : f;
					aa = ai = false;
				}
			};
			const nextId = () => {
				c++;
				let s = process.argv[c];
				if (!s) s = '';
				return s;
			};
			const getId = () => {
				if (ai) {
					let id = this.parseId(this.current);
					if (id.length) {
						do {
							this.id.push(id);
							id = this.parseId(nextId());
							if (!id.length) c--;
						} while (id.length);
					} else {
						throw Error(`Invalid identity ${this.current}`);
					}
					aa = false;
				} else {
					throw Error(`Unrecognised input ${this.current}`);
				}
			};
			// eslint-disable-next-line
			while ((c < process.argv.length - 1) && (aa || ai || ao)) {
				c++;
				this.current = process.argv[c];
				switch (this.current) {
					case '-a': case '--audioQuality': getWordOption('audioQuality', ['highest', 'medium', 'lowest',
						'none']); break;
					case '-c': case '--cookie': getStringOption('cookie'); break;
					case '-d': case '--download': getAction('download'); break;
					case '-f': case '--filename': getStringOption('filename'); break;
					case '-h': case '--help': getAction('help'); break;
					case '-i': case '--info': getAction('info'); break;
					case '-l': case '--length': getWordOption('duration', ['any', 'short', 'long']); break;
					case '-m': case '--metadata': getMetadata(); break;
					case '-o': case '--order': getWordOption('order', ['relevance', 'age', 'views', 'rating', 'new',
						'old', 'updated']); break;
					case '-p': case '--path': getStringOption('path'); break;
					case '-q': case '--query': getStringOption('query'); break;
					case '-r': case '--result': getAction('result'); break;
					case '-s': case '--streamInfo': getAction('streamInfo'); break;
					case '-sf': case '--saveFilename': getStringOption('saveFilename'); break;
					case '-sp': case '--savePath': getStringOption('savePath'); break;
					case '-u': case '--userAgent': getStringOption('userAgent'); break;
					case '-v': case '--videoQuality': getWordOption('videoQuality', ['highest', '1080p', '720p', '480p',
						'medium', '360p', '240p', '144p', 'lowest', 'none']); break;
					case '-A': case '--audioFormat': getNumberOption('audioFormat'); break;
					case '-C': case '--container': getWordOption('container', ['any', 'mp4', 'webm', 'mkv', 'mp3',
						'flac']); break;
					case '-F': case '--features': getFeatures(); break;
					case '-I': case '--items': getWordOption('items', ['any', 'videos', 'playlists', 'channels', 'about',
						'search']); break;
					case '-L': case '--limit': getLimits(); break;
					case '-M': case '--mediaBitrate': getWordOption('mediaBitrate', ['highest', 'lowest']); break;
					case '-O': case '--overwrite': getWordOption('overwrite', ['yes', 'no']); break;
					case '-P': case '--period': getWordOption('period', ['hour', 'day', 'week', 'month', 'year',
						'any']); break;
					case '-R': case '--repeat': getNumberOption('repeat'); break;
					case '-Q': case '--quantity': getNumberOption('quantity'); break;
					case '-S': case '--save': getWordOption('save', ['all', 'info', 'raw', 'none']); break;
					case '-V': case '--videoFormat': getNumberOption('quantity'); break;
					default: getId(); break;
				}
			}
			this.session = new ytcog.Session(this.cookie, this.agent);
			await this.session.fetch();
			if (this.session.status === 'OK') {
				await this.process();
				if (this.repeat > 0) setInterval(this.process, this.repeat * 1000);
			} else {
				console.log(`Session - failed to get data`);
				console.log(`Status: ${this.session.status} (${this.session.reason})`);
			}
		} catch (e) {
			console.log(e);
		}
	}

	async process() {
		try {
			switch (this.object) {
				case 'video':
					this.options.path = this.savePath;
					if (this.saveFilename.length) this.options.filename = this.saveFilename;
					this.id.forEach(id => {
						this.options.id = id;
						this.video[id] = new ytcog.Video(this.session, this.options);
					});
					switch (this.action) {
						case 'info': this.id.forEach(id => this.video_info(id)); break;
						case 'streamInfo': this.id.forEach(id => this.video_streamInfo(id)); break;
						case 'batch':
						case 'download':
							if (this.id.length === 1) await this.video_download(this.id[0]);
							if (this.id.length > 1) this.batch_download();
							break;
						default: break;
					}
					break;
				case 'channel':
					this.id.forEach(async id => {
						this.options.id = id;
						this.channel = new ytcog.Channel(this.session, this.options);
						let items = this.channel.options.items;
						await this.channel.fetch({ items: 'about' });
						this.channel.updateOptions({ items: items });
						if (this.channel.status === 'OK') {
							switch (this.action) {
								case 'info': this.channel_info(); break;
								case 'result': this.channel_result(); break;
								case 'batch':
								case 'download': this.channel_download(); break;
								default: break;
							}
						} else {
							console.log(`Channel ${this.options.id} failed to get data`);
							console.log(`Status: ${this.channel.status} (${this.channel.reason})`);
						}
					});
					break;
				case 'playlist':
					this.id.forEach(async id => {
						this.options.id = id;
						this.playlist = new ytcog.Playlist(this.session, this.options);
						await this.playlist.fetch();
						if (this.playlist.status === 'OK') {
							switch (this.action) {
								case 'info': this.playlist_info(); break;
								case 'result': this.playlist_result(); break;
								case 'batch':
								case 'download': this.playlist_download(); break;
								default: break;
							}
						} else {
							console.log(`Playlist ${this.options.id} failed to get data`);
							console.log(`Status: ${this.playlist.status} (${this.playlist.reason})`);
						}
					});
					break;
				case 'search':
					this.search = new ytcog.Search(this.session, this.options);
					await this.search.fetch();
					if (this.search.status === 'OK') {
						switch (this.action) {
							case 'result': this.search_result(); break;
							case 'batch':
							case 'download': this.search_download(); break;
							default: break;
						}
					} else {
						console.log(`Search ${this.options.query} failed to get data`);
						console.log(`Status: ${this.search.status} (${this.search.reason})`);
					}
					break;
				default:
					break;
			}
		} catch (e) {
			console.log(e);
		}
	}
}

const app = new Command();
app.run();
