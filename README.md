# ytcog-dl (testing...)
Command line interface (CLI) for the [ytcog innertube library](https://github.com/gatecrasher777/ytcog)  
(Work-in-progress)

A CLI wrapper to ytcog. From the command line you can:

* Download videos from ids/urls or from search, channel or playlist results
* Obtain video information
* Output a stream summary to help choose specific streams
* Save search results: videos, playlists, channels, movies
* Save channel info and videos, playlists, related channels, or channel search results
* Save playlist info and videos 

Each command line request represents a completed session. 
If you need the added efficiency of a maintained session, you can use the [ytcog innertube library](https://github.com/gatecrasher777/ytcog) directly.

## Usage

### In general:
```bash
~$ ytcog-dl [action] [id id id ...] [options]
```

#### Actions

    --batch         -b    batch download videos from channel, playlist or search results
    --download      -d    download one or more specified video(s)
    --help          -h    output useage/actions/options to console
    --info          -i    fetch video/channel/playlist information - written to "_info.json" and "_raw_info.json" files.  
                          (raw: as supplied by youtube)
    --result        -r    fetch search/channel/playlist results - written to "_results.json" and "_raw_results.json" files.
                          (raw: as supplied by youtube)
    --streamInfo    -s    output stream summary of video(id) to the console (assists stream selection)
    --version       -ver  provides ytcog and ytcog-dl version information

#### General Options

    --cookie        -c string - provide a logged-in YouTube cookie string - default: ""   
    --save          -S all|info|raw|none - retrieved data save options 
                        * all                   - save ytcog and raw yt generated json files
                        * info                  - save ytcog generated json files only
                        * raw                   - save raw yt generated json files only
                        * none                  - save nothing  
    --saveFilename  -sf string - supply a filename without path or extension - you can any other video/channel/search info 
                        properties as templates in the string. For example:
                        ${author} ${date} ${datetime} ${id} ${timestamp} ${title} etc...
                        Each request type has an appropriate default.
    --savePath      -sp string - data save path - defaults to '.' the current directory 
    --userAgent     -u string - user agent string - default: one is chosen for you

### Video Downloads

```bash
~$ ytcog-dl [-d|--download] id [id id ... ][options]
```

__id__ (string) is either an 11 character YouTube video id or a video watch url.  
__options__ (object) any of the [video download options](https://github.com/gatecrasher777/ytcog-dl/wiki/Video#download-options)  

### Video Information

```bash
~$ ytcog-dl -i|--info id [id id ... ][options]
```

__id__ (string) is either an 11 character YouTube video id or a video watch url.  
__options__ (object) any of the [video information options](https://github.com/gatecrasher777/ytcog-dl/wiki/Video#information-options)
                        
### Video Stream Summary

Prints a concise list of available streams for a video to the console. The order is determined by an algorithm based on your preferences.

```bash
~$ ytcog-dl -s|--streamInfo id [id id ... ][options]
```

__id__ (string) is either an 11 character YouTube video id or a video watch url.  
__options__ (object) any of the [video stream summary options](https://github.com/gatecrasher777/ytcog-dl/wiki/Video#stream-summary-options)

See [Video examples](https://github.com/gatecrasher777/ytcog-dl/wiki/Video#examples)

### Channel information

Collects channel metadata and properties and saves the data.

```bash
~$ ytcog-dl [-i|--info] id [id id ... ][options]
```

__id__ (string) is either an 24 character YouTube channel id  (commencing 'UC') or a channel url.  
__options__ (object) any of the [channel information options](https://github.com/gatecrasher777/ytcog-dl/wiki/Channel#information-options)

### Channel results

Collects detailed lists of videos, playlists, and related channels and allows you to search a channel.  

```bash
~$ ytcog-dl -r|--result id [id id ... ][options]
```

__id__ (string) is either an 24 character YouTube channel id  (commencing 'UC') or a channel url.  
__options__ (object) any of the [channel result options](https://github.com/gatecrasher777/ytcog-dl/wiki/Channel#result-options)
     
### Channel downloads

Batch download videos from a channel. 

```bash
~$ ytcog-dl [-b|--batch] id [id id ... ][options]
```

__id__ (string) is either an 24 character YouTube channel id  (commencing 'UC') or a channel url.  
__options__ (object) any of the [channel download options](https://github.com/gatecrasher777/ytcog-dl/wiki/Channel#download-options)

See [Channel examples](https://github.com/gatecrasher777/ytcog-dl/wiki/Channel#examples)

### Playlist information

Collects metadta and properties of a playlist.

```bash
~$ ytcog-dl -i|-info id [id id ... ][options]
```

__id__ (string) is either an 34 character YouTube channel id  (commencing 'PL') or a playlist url.  
__options__ (object) any of the [playlist information options](https://github.com/gatecrasher777/ytcog-dl/wiki/Playlist#information-options)

### Playlist results

Collects video results from a playlist.

```bash
~$ ytcog-dl -r|--result id [id id ... ][options]
```

__id__ (string) is either an 34 character YouTube channel id  (commencing 'PL') or a playlist url.  
__options__ (object) any of the [playlist result options](https://github.com/gatecrasher777/ytcog-dl/wiki/Playlist#result-options)

### PLaylist downloads

Batch download videos from a playlist. 

```bash
~$ ytcog-dl [-b|--batch] id [id id ... ][options]
```

__id__ (string) is either an 34 character YouTube channel id  (commencing 'PL') or a playlist url.  
__options__ (object) any of the [playlist download options](https://github.com/gatecrasher777/ytcog-dl/wiki/Playlist#download-options)

See [Playlist examples](https://github.com/gatecrasher777/ytcog-dl/wiki/Search#examples)

### Search results

```bash
~$ ytcod-dl -r|result [options]
```
__options__ (object) any of the [search result options](https://github.com/gatecrasher777/ytcog-dl/wiki/Search#result-options)

### Search results

```bash
~$ ytcod-dl [-b|--batch] [options]
```
__options__ (object) any of the [search download options](https://github.com/gatecrasher777/ytcog-dl/wiki/Search#download-options)

See [Search examples](https://github.com/gatecrasher777/ytcog-dl/wiki/Search#examples)

## Installation

```bash
~$ npm install -g ytcog-dl
```
