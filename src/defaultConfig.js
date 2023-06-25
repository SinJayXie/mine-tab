export default {
    search_engine: 'baidu', // 搜索引擎
    search_engine_option: {
        baidu: 'https://www.baidu.com/#ie=UTF-8&wd=($QUERY_STRING$)',
        google: 'https://www.google.com/search?q=($QUERY_STRING$)',
        bing: 'https://www.bing.com/search?q=($QUERY_STRING$)'
    },
    wallpaper_url: '',
    install: Date.now()
}