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

### In general:
```bash
~$ ytcog-dl [action] id [id id ...] [options]
```
Except for obtaining search results at least one __id__ is mandatory and can be 
* a video watch url, 
* an 11 character YouTube video id,
* a channel url or
* a 24 character channel id (beginning with "UC")  

#### Actions

    --download      -d    download media file
    --help          -h    output useage/actions/options to console
    --info          -i    fetch video/channel information - written to "_info.json" and "_raw_info.json" files. (raw: as   
    supplied by youtube)
    --streamInfo    -s    output stream summary of video(id) to console 
    --version       -v    ytcog-dl version
    --results       -r    fetch search/channel results - written to "_results.json" and "_raw_results.json" files (raw: as  
    supplied by youtube)  

#### General options (common to all requests)

     --cookie        -c string - provide a logged-in YouTube cookie string - default: ""
    
     --userAgent     -u string - user agent string - default: one is chosen for you

### Video Downloads

```bash
~$ ytcog-dl [-d] id [id id ... ][options]
```

#### Options

    --audioFormat   -x number - specific audio stream number to download - default: -1 (use preference algorithm and fallback   
                       streams)
    
    --audioQuality  -a highest|medium|lowest|none - audio quality preference - none for video only - default: medium
        
    --container     -e any|mp4|webm|mkv - provide your container preference - default: any
        * any                   - no preference between mp4 (h264 with aac) or webm (vp9 with opus) (default)
        * mp4                   - prefers mp4 codecs to webm codecs when quality is equal
        * webm                  - prefers webm codecs to mp4 codecs when quality is equal 
        * mkv                   - no preference and can additionally allow mixed formats (vp9 with aac) or (mp4 with opus). 
    
    --filename      -f string - supply a filename - you can use the following placeholders in your filename string, 
                       such as:
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
    
    --mediaBitrate  -b highest|lowest - prefered bitrate when quality of two streams is equal - default: highest
    
    --metadata      -m author|title|description|keywords|published|comment [string] - video property to embed in downloaded file  
                       one or more (i.e. -m author -m title) of  
                        * author          - reflects as AUTHOR in webm/mkv containers, as artist in mp4 containers
                        * title           - reflects as TITLE in webm/mkv containers, as title in mp4 containers
                        * description     - reflects as DESCRIPTION in webm/mkv containers, as description in mp4 containers
                        * keywords        - reflects as KEYWORDS in webm/mkv containers, as synopsis in mp4 containers
                        * published       - reflects as DATE in webm/mkv containers, as date in mp4 containers
                        * comment string  - custom text, reflects as COMMENT in webm/mkv, as comment in mp4 containers
                       [string] is required for a comment metadata, and if specified for any other metadata fields its value  
                       will be used to override the fetched video property.
    
    --path          -p "path/to/download/folder" - defaults to the current directory  
    
    --videoFormat   -x number - specific video stream to download | default: -1 (use preference algorithm and fallback streams)
    
    --videoQuality  -v highest|1080p|720p|480p|medium|360p|240p|144p|lowest|none - video quality preference - none for audio only  
                       default 1080p
                       
### Video information

```bash
~$ ytcog-dl -i id [id id ... ][options]
```

#### Options
    
    --filename      -f string - supply a filename without path or extension - you can use the placeholders in your filename string,  
                       such as:
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
    
    --raw           -r yes|no|only - save raw data options 
                        * yes                   - save raw json files, 
                        * no                    - skip saving raw json files (default), 
                        * only                  - save only the raw json files (not the video object created by ytcog-dl)  
                        
### Stream summaries

```bash
~$ ytcog-dl -s id [id id ... ][options]
```

#### Options

    --audioQuality  -a highest|medium|lowest|none - audio quality preference - none for video only - default medium
    
    --container     -e any|mp4|webm|mkv - provide your container preference - default is mkv
    
    --mediaBitrate  -m highest|lowest - prefered bitrate when quality is equal - default: highest
    
    --videoQuality  -v highest|1080p|720p|480p|medium|360p|240p|144p|lowest|none - video quality preference - none for audio only  
                       default: 1080p
                       
### Channel information
```bash
~$ ytcog-dl -i id [id id ... ][options]
```

#### Options    
    
    --filename      -f string - supply a filename without path or extension - you can use the placeholders in your filename string,  
                       such as:
                        * ${author}             - channel display name
                        * ${date}               - YYYYMMDD - current date 
                        * ${datetime}           - YYYYMMDD HHMMSS - current date & time 
                        * ${id}                 - channel id
                        * ${timestamp}          - unix timestamp - seconds since the epoch, current timestamp
                        * ${...}                - you can use any other video/channel/search info properties
                       The default filename is "${author}_${id}_${datetime}"
                       
    --path          -p "path/to/download/folder" - defaults to the current directory  
    
    --raw           -r yes|no|only - save raw data options 
                        * yes                   - save raw json files, 
                        * no                    - skip saving raw json files (default), 
                        * only                  - save only the raw json files (not the channel object created by ytcog-dl)  

### Channel results

```bash
~$ ytcog-dl [-r] id [id id ... ][options]
```

#### Options    
    
    --filename      -f string - supply a filename without path or extension - you can use the placeholders in your filename    
                       string, such as:
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
    
    --raw           -r yes|no|only - save raw data options 
                        * yes                   - save raw json files, 
                        * no                    - skip saving raw json files (default), 
                        * only                  - save only the raw json files (not the channel results created by ytcog-dl)  

### Search results

```bash
~$ ytcod-dl [-r] [options]
```

#### Options
    
    --features      -F live|4k|hd|subtitles|cc|360|vr180|3d|hdr|location|purchased  
                       you can add one (ie -F live) or more (ie -F live -F hd) features from:
                        * live                  - only include live videos
                        * 4k                    - only include videos with 4k resolution
                        * hd                    - only include videos with high definition
                        * subtitles             - only include videos with subtitles or close captions
                        * cc                    - only include videos published under creative commons licence
                        * 360                   - only include 360 degree videos
                        * vr180                 - only include virtual reality 180 degree videos
                        * 3d                    - only include 3 dimensional videos
                        * hdr                   - only include videos with high dynamic range 
                        * location              - only include videos with geolocation tagging
                        * purchased             - only include videos you have purchased
        
    --filename      -f string - supply a filename without path or extension  
                       you can use the placeholders in your filename string, such as:
                        * ${date}               - YYYYMMDD - current date
                        * ${datetime}           - YYYYMMDD HHMMSS - current date & time      
                        * ${order}              - result order
                        * ${period}             - result period
                        * ${query}              - search term
                        * ${timestamp}          - unix timestamp - seconds since the epoch, current timestamp
                        * ${...}                - you can use any other search info properties
                        The default filename is "${query}_${datetime}_${order}_${period}"
        
    --items         -i any|videos|channels|playlists|movies - what items to search for - default: videos
   
    --length        -l any|short|medium|long - length of videos to include in search results 
                        * any                   - videos of any length (default)
                        * short                 - videos less than 4 minutes long
                        * medium                - videos from 4 to 20 minutes long
                        * long                  - videos longer than 20 minutes
   
    --order         -o relevance|age|views|rating - order of results - one of 
                        * relevance   - in order of relevance to search term
                        * age         - in age order, newest to oldest
                        * views       - in order of view count, most to least
                        * rating      - in order of like/dislike rating (1 to 5)
    
    --path          -p "path/to/download/folder" - defaults to the current directory  
    
    --period        -t hour|day|week|month|year|any - search result period - default: day
    
    --query         -q string - provide a search term - default: "video"
    
    --quantity      -n number - minimum number of results to fetch (if available) - default: 100
    
    --raw           -r yes|no|only - save raw data options 
                        * yes                   - save raw json files, 
                        * no                    - skip saving raw json files (default), 
                        * only                  - save only the raw json files (not the search object created by ytcog-dl)  
    
## Examples 
    
```bash
// downloads 3 videos at highest quality, preferring webm:
~$ ytcog-dl https://www.youtube.com/watch?v=jsadYFJBH1h 78fklaTjkW- www.youtube.com/watch?v=alN0qw1Ojdh -v highest -e webm 

//downlaod a video with filename consisting of the original title. Embed specified metadata
~$ ytcod-dl jsadYFJBH1h -f "${title}" -d author -d title -d comment "my first video"

// get the 60+ newest videos from a channel
~$ ytcog-dl UC128HASYghgkjYGEYGVS-J1 

// get 20+ most viewed video results using the search term "soccer" over the past week
~$ ytcog-dl -q "soccer" -t week -o views -n 20 
```
