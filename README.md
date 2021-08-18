# ytcog-dl
Command line interface (CLI) for the ytcog innertube library  
(Work-in-progress)

A CLI wrapper to ytcog. From the command line you can:

* Download one or more videos 
* Obtain video information
* Output a stream summary to choose specific streams
* Obtain channel information
* Fetch channel video results
* Fetch search results

## Usage

### Download one or more videos
```js
ytcog-dl [-d] id [id id ... ][options]
```
### Obtain video information
```js
ytcog-dl -i id [options]
```
### Output stream summary
```js
ytcog-dl -s id [options]
```
### Obtain channel information
```js
ytcog-dl -i id [options]
```
### Obtain channel results
```js
ytcog-dl id [options]
```
### Obtain search results
```js
ytcod-dl [options]
```
Except for obtaining search results __id__ is mandatory and can be 
* a video watch url, 
* an 11 character YouTube video id,
* a channel url or
* a 24 character channel id (beginning with "UC")  

## Actions
    --download      -d    download media file
    --help          -h    output useage/actions/options to console
    --info          -i    fetch video/channel information - written to ".info.json" and ".raw.json" files.
    --streamInfo    -s    output stream summary of video(id) to console 
    --version       -v    ytcog-dl version
## Options
    --audioFormat   -x number | choose a specific audio stream number (after running stream summary) | default -1 use preference algorithm and fallbacks
    --audioQuality  -a [highest|medium|lowest|none] | audio quality preference | none for video only | default medium
    --cookie        -c string | provide a logged-in YouTube cookie string | default ""
    --container     -e [any|mp4|webm|mkv] | provide your container preference | default is mkv
    --duration      -n [any|short|long] | duration of videos in search results | short <4min, long >20m | default any
    --filename      -f string | supply a filename without an extension | you can use the following placeholders in your filename string:
        * ${audioCodec}         | aac or opus
        * ${author}        
        * ${channelId}
        * ${date}               | YYYYMMDD 
        * ${datetime}           | YYYYMMDD HHMMSS
        * ${id}                         
        * ${order}              | result order
        * ${period}             | result period
        * ${timestamp}          | unix timestamp - seconds since the epoch
        * ${title}          
        * ${videoCodec}         | h264 or vp9
        * ${videoQuality}       | i.e. 1080p, 360p, etc
        * default filenames are: 
        * download              | "${author} - ${title} - ${id} - ${videoQuality} - ${videoCodec} - {audioCodec}"
        * video information     | "${author} - ${title} - ${id} - ${timestamp}"
        * channel information   | "${author} - ${channelId} - ${timestamp}"
        * channel results       | "${author} - ${channelId} - ${order} - ${timestamp}"
        * search results        | "${query} - ${order} - ${period} - ${timestamp}"    
    --mediaBitrate  -m [highest/lowest] | prefered bitrate when quality is equal | default highest
    --order         -o [relevance|age|views|rating|new|old] | order of results | search: relevance (default), age, views, rating, channel: new (default),old,views
    --path          -p "path to download folder" | defaults to current directory  
    --period        -t [hour|day|week|month|year|any] | search result period | default: day
    --query         -q string | provide a search term | default: "video"
    --results       -r number | minimum number of results to fetch (if available) | default: 60 (channel) 100 (search)
    --userAgent     -u "user agent string" | default "" - one is chosen for you
    --videoFormat   -x streamNumber | choose a specific video stream (after running stream summary) | default -1 use preference algorithm and fallbacks
    --videoQuality  -v [hightest|1080p|720p|480p|medium|360p|240p|144p|lowest|none] | video quality preference | none for audio only | default 1080p
    
