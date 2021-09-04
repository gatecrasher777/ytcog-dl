# ytcog-dl
Command line interface (CLI) for the [ytcog innertube library](https://github.com/gatecrasher777/ytcog)  
(Work-in-progress)

A CLI wrapper to ytcog. From the command line you can:

* Download one or more videos 
* Obtain video information
* Output a stream summary to choose specific streams
* Obtain channel information
* Fetch channel video results
* Fetch search results

Each command line request represents a completed session. 
If you need the added efficiency of a maintaned session, rather use the [ytcog innertube library](https://github.com/gatecrasher777/ytcog) directly.  

## Usage

In general:
```bash
~$ ytcog-dl [action] id [id id ...] [options]
```
### Download one or more videos
```bash
~$ ytcog-dl [-d] id [id id ... ][options]
```
### Obtain information on one or more videos
```bash
~$ ytcog-dl -i id [id id ... ][options]
```
### Output stream summaries for one or more videos
```bash
~$ ytcog-dl -s id [id id ... ][options]
```
### Obtain information on one or more channels
```bash
~$ ytcog-dl -i id [id id ... ][options]
```
### Obtain video channel results from one or more channels
```bash
~$ ytcog-dl [-r] id [id id ... ][options]
```
### Obtain video search results
```bash
~$ ytcod-dl [-r] [options]
```
Except for obtaining search results at least one __id__ is mandatory and can be 
* a video watch url, 
* an 11 character YouTube video id,
* a channel url or
* a 24 character channel id (beginning with "UC")  

## Actions

    --download      -d    download media file
    --help          -h    output useage/actions/options to console
    --info          -i    fetch video/channel information - written to "_info.json" and "_raw_info.json" files. (raw: as supplied by youtube)
    --streamInfo    -s    output stream summary of video(id) to console 
    --version       -v    ytcog-dl version
    --results       -r    fetch search/channel results - written to "_results.json" and "_raw_results.json" files (raw: as supplied by youtube)  

## Options

### Download options

    --audioFormat   -x number - choose a specific audio stream number (after running stream summary) - default -1 use preference algorithm and fallback streams
    --audioQuality  -a highest|medium|lowest|none - audio quality preference - none for video only - default medium
    --cookie        -c string - provide a logged-in YouTube cookie string - default ""
    --container     -e any|mp4|webm|mkv - provide your container preference - default is mkv
    --filename      -f string - supply a filename without path or extension - you can use the placeholders in your filename string, such as:
        * ${audioCodec}         - aac or opus
        * ${author}             - channel display name
        * ${channel}            - channel id of video
        * ${date}               - YYYYMMDD - published date for video
        * ${datetime}           - YYYYMMDD HHMMSS - published date & time for video
        * ${id}                 - video id        
        * ${timestamp}          - unix timestamp - seconds since the epoch, published timestamp for video
        * ${title}              - video title
        * ${videoCodec}         - h264 or vp9
        * ${videoQuality}       - i.e. 1080p, 360p, etc
        * ${...}                - you can use any other video/channel/search info properties
        The default filename is "${author}_${datetime}_${title}_${id}_${videoQuality}_${videoCodec}_${audioCodec}"
    --mediaBitrate  -m highest|lowest - prefered bitrate when quality is equal - default: highest
    --metadata      -d string - supply a string of comma separated video properties to embed in the downloaded file - no metadata is embedded by default. One or more of  
        * author                - Will reflect as AUTHOR in webm/mkv containers, as artist in mp4
        * title                 - Will reflect as TITLE in webm/mkv containers, as title in mp4
        * description           - Will reflect as DESCRIPTION in webm/mkv containers, as description in mp4
        * keywords              - Will reflect as KEYWORDS in webm/mkv containers, as synopsis in mp4 
        * published             - Will reflect as DATE in webm/mkv containers, as date in mp4
        * comment=text          - Add some custom text, Will reflect as COMMENT in webm/mkv, as comment in mp4 
    --path          -p "path/to/download/folder" - defaults to the current directory  
    --userAgent     -u string - user agent string - default: one is chosen for you
    --videoFormat   -x streamNumber - choose a specific video stream (after running stream summary) | default -1 use preference algorithm and fallback streams
    --videoQuality  -v highest|1080p|720p|480p|medium|360p|240p|144p|lowest|none - video quality preference - none for audio only - default 1080p
    
### Video information options

    --cookie        -c string - provide a logged-in YouTube cookie string - default ""
    --filename      -f string - supply a filename without path or extension - you can use the placeholders in your filename string, such as:
        * ${author}             - channel display name
        * ${channel}            - channel id of video
        * ${date}               - YYYYMMDD - published date for video
        * ${datetime}           - YYYYMMDD HHMMSS - published date & time for video
        * ${id}                 - video or channel id
        * ${timestamp}          - unix timestamp - seconds since the epoch, published timestamp for video
        * ${title}              - video title
        * ${...}                - you can use any other video info properties
        The default filename is  "${author}_${datetime}_${title}_${id}"
    --path          -p "path/to/download/folder" - defaults to the current directory  
    --raw           -r yes|no|only - yes: save raw json files, no: skip saving raw json files (default), only: save only the raw json files (not those created by ytcog-dl)
    --userAgent     -u string - user agent string - default: one is chosen for you
    
### Stream summary options

    --audioFormat   -x number - choose a specific audio stream number (after running stream summary) - default -1 use preference algorithm and fallback streams
    --audioQuality  -a highest|medium|lowest|none - audio quality preference - none for video only - default medium
    --cookie        -c string - provide a logged-in YouTube cookie string - default ""
    --container     -e any|mp4|webm|mkv - provide your container preference - default is mkv
    --mediaBitrate  -m highest|lowest - prefered bitrate when quality is equal - default: highest
    --userAgent     -u string - user agent string - default: one is chosen for you
    --videoFormat   -x streamNumber - choose a specific video stream (after running stream summary) | default -1 use preference algorithm and fallback streams
    --videoQuality  -v highest|1080p|720p|480p|medium|360p|240p|144p|lowest|none - video quality preference - none for audio only - default 1080p
    
### Channel information options    
    
    --cookie        -c string - provide a logged-in YouTube cookie string - default ""
    --filename      -f string - supply a filename without path or extension - you can use the placeholders in your filename string, such as:
        * ${author}             - channel display name
        * ${date}               - YYYYMMDD - current date 
        * ${datetime}           - YYYYMMDD HHMMSS - current date & time 
        * ${id}                 - channel id
        * ${timestamp}          - unix timestamp - seconds since the epoch, current timestamp
        * ${...}                - you can use any other video/channel/search info properties
        The default filename is "${author}_${id}_${datetime}"
    --path          -p "path/to/download/folder" - defaults to the current directory  
    --raw           -r yes|no|only - yes: save raw json files, no: skip saving raw json files (default), only: save only the raw json files (not those created by ytcog-dl)
    --userAgent     -u string - user agent string - default: one is chosen for you   
    
### Channel result options    
    
    --cookie        -c string - provide a logged-in YouTube cookie string - default ""
    --filename      -f string - supply a filename without path or extension - you can use the placeholders in your filename string, such as:
        * ${author}             - channel display name
        * ${date}               - YYYYMMDD - current date
        * ${datetime}           - YYYYMMDD HHMMSS - current date & time
        * ${id}                 - channel id
        * ${order}              - result order
        * ${timestamp}          - unix timestamp - seconds since the epoch, current timestamp
        * ${...}                - you can use any other video/channel/search info properties
        The default filename is "${author}_${id}_${datetime}_${order}"
    --order         -o new|old|views - order of results - default: new 
    --path          -p "path/to/download/folder" - defaults to the current directory  
    --quantity      -n number - minimum number of results to fetch (if available) - default: 60 
    --raw           -r yes|no|only - yes: save raw json files, no: skip saving raw json files (default), only: save only the raw json files (not those created by ytcog-dl)
    --userAgent     -u string - user agent string - default: one is chosen for you       
    
### Search result options
    
    --cookie        -c string - provide a logged-in YouTube cookie string - default ""
    --length        -l any|short|medium|long - length of videos to include in search results - short <4min, medium 4min-20min, long >20min - default any
    --filename      -f string - supply a filename without path or extension - you can use the placeholders in your filename string, such as:
        * ${date}               - YYYYMMDD - current date
        * ${datetime}           - YYYYMMDD HHMMSS - current date & time      
        * ${order}              - result order
        * ${period}             - result period
        * ${query}              - search term
        * ${timestamp}          - unix timestamp - seconds since the epoch, current timestamp
        * ${...}                - you can use any other search info properties
        The default filename is "${query}_${datetime}_${order}_${period}"
    --order         -o relevance|age|views|rating - order of results - default: relevance
    --path          -p "path/to/download/folder" - defaults to the current directory  
    --period        -t hour|day|week|month|year|any - search result period - default: day
    --query         -q string - provide a search term - default: "video"
    --quantity      -n number - minimum number of results to fetch (if available) - default: 100
    --raw           -r yes|no|only - yes: save raw json files, no: skip saving raw json files (default), only: save only the raw json files (not those created by ytcog-dl)
    --userAgent     -u string - user agent string - default: one is chosen for you
    
## Examples 
    
```bash
~$ ytcog-dl https://www.youtube.com/watch?v=jsadYFJBH1h 78fklaTjkW- www.youtube.com/watch?v=alN0qw1Ojdh -v highest -e webm // downloads 3 videos at highest quality, preferring webm
~$ ytcod-dl jsadYFJBH1h -f "${title}" -d "author,title,published,comment=my first video" //downlaod a video with filename consisting of the original title. Embed specified metadata
~$ ytcog-dl UC128HASYghgkjYGEYGVS-J1 // get the 60+ newest videos from a channel
~$ ytcog-dl -q "soccer" -t week -o views -n 20 // get 20+ most viewed results using the search term "soccer" over the past week
```
