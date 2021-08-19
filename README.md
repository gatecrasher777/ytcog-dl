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
    --info          -i    fetch video/channel information - written to ".info.json" and ".raw.json" files.
    --streamInfo    -s    output stream summary of video(id) to console 
    --version       -v    ytcog-dl version
    --results       -r    fetch search/channel results
## Options
    --audioFormat   -x number | choose a specific audio stream number (after running stream summary) | default -1 use preference algorithm and fallbacks
    --audioQuality  -a [highest|medium|lowest|none] | audio quality preference | none for video only | default medium
    --cookie        -c string | provide a logged-in YouTube cookie string | default ""
    --container     -e [any|mp4|webm|mkv] | provide your container preference | default is mkv
    --length        -l [any|short|long] | length of videos to include in search results | short <4min, long >20m | default any
    --filename      -f string | supply a filename without an extension | you can use the placeholders in your filename string, such as:
        * ${audioCodec}         | aac or opus
        * ${author}        
        * ${channel}            | channel id of video
        * ${date}               | YYYYMMDD - current date for channel/search, published date for video
        * ${datetime}           | YYYYMMDD HHMMSS - current date & time for channel/search, published date & time for video
        * ${id}                 | video or channel id        
        * ${order}              | result order
        * ${period}             | result period
        * ${timestamp}          | unix timestamp - seconds since the epoch, current timestamp for channel/search, published timestamp for video
        * ${title}          
        * ${videoCodec}         | h264 or vp9
        * ${videoQuality}       | i.e. 1080p, 360p, etc
        * ${...}                | you can use any other video/channel/search info properties
        * default filenames are: 
        * download              | "${author} - ${datetime} - ${title} - ${id} - ${videoQuality} - ${videoCodec} - ${audioCodec}"
        * video information     | "${author} - ${datetime} - ${title} - ${id}"
        * channel information   | "${author} - ${id} - ${datetime}"
        * channel results       | "${author} - ${id} - ${datetime} - ${order}"
        * search results        | "${query} - ${datetime} - ${order} - ${period}"
         
    --mediaBitrate  -m [highest/lowest] | prefered bitrate when quality is equal | default highest
    --order         -o [relevance|age|views|rating|new|old] | order of results | search: relevance (default), age, views, rating, channel: new (default),old,views
    --path          -p "path to download folder" | defaults to current directory  
    --period        -t [hour|day|week|month|year|any] | search result period | default: day
    --query         -q string | provide a search term | default: "video"
    --quantity      -n number | minimum number of results to fetch (if available) | default: 60 (channel) 100 (search)
    --userAgent     -u string | user agent string | default "" one is chosen for you
    --videoFormat   -x streamNumber | choose a specific video stream (after running stream summary) | default -1 use preference algorithm and fallbacks
    --videoQuality  -v [highest|1080p|720p|480p|medium|360p|240p|144p|lowest|none] | video quality preference | none for audio only | default 1080p
    
## Examples 
    
```bash
~$ ytcog-dl https://www.youtube.com/watch?v=jsadYFJBH1h 78fklaTjkW- www.youtube.com/watch?v=alN0qw1Ojdh -v highest -e webm // downloads 3 videos at highest quality, preferring webm.
~$ ytcog-dl UC128HASYghgkjYGEYGVS-J1 // get the 60+ newest videos from a channel
~$ ytcog-dl -q "soccer" -t week -o views -n 20 // get 20+ results using the search term "soccer" over the past week, ordered by most views
```
