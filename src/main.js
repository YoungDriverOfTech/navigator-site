const $siteList = $('.siteList');
const lastLi = $siteList.find('li.last');
// 从localstorage中读取hashMap的值
const x = localStorage.getItem('x');
const xObject = JSON.parse(x);
const hashMap = xObject || [
    {logo: 'A', url: 'https://www.acfun.cn'}
]

// 去除url里面的http://www.
const simplifyUrl = (url) =>{
    return url.replace('https://', '')
        .replace('https//', '')
        .replace('www.', '')
        .replace(/\/.*/, '') // 正则表达：删除/开头内容

}

hashMap.forEach(node => {
    const $li = $(`<li>
                <a href="${node.url}">
                    <div class="site">
                        <div class="logo">${node.logo}</div>
                        <div class="link">${simplifyUrl(node.url)}</div>
                    </div>
                </a>
            </li>`).insertBefore(lastLi);
})

// 渲染页面
const render = () =>{
    // 清空之前的hashMap，并再次渲染hashMap
    $siteList.find('li:not(.last)').remove();
    hashMap.forEach((node,index )=> {
        const $li = $(`<li>
                <div class="site">
                    <div class="logo">${node.logo[0]}</div>
                    <div class="link">${simplifyUrl(node.url)}</div>
                    <div class="close">
                        <svg class="icon">
                            <use xlink:href="#icon-close"></use>
                        </svg>
                    </div>
                </div>
            </li>`).insertBefore(lastLi);
        $li.on('click', () => {
            window.open(node.url)
        })

        // 阻止点击事件冒泡/删除功能
        $li.on('click', '.close', e => {
            e.stopPropagation();
            hashMap.splice(index,1);
            render();
        })
    })
}

render();

$('.addButton').on('click', () => {
    let url = window.prompt('请输入要添加的网站');
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url;
    }
    console.log(url);

    // 把新增网站的信息，存入hashMap
    hashMap.push({
        logo: simplifyUrl(url)[0],
        url: url
    })
    render();
})

// 用户在关闭页面之前监听
window.onbeforeunload = () =>{
    // 页面每次关闭之前把hashMap的值存入localStorage
    const string = JSON.stringify(hashMap);
    localStorage.setItem('x', string);
}

$(document).on('keypress', (e) => {
    const {key} = e;
    for (let i=0; i<hashMap.length; i++){
        if (hashMap[i].logo.toLowerCase() === key){
            window.open(hashMap[i].url);
        }
    }
})
