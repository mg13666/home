// 页面载入设置
function removeLoading() {
    document.body.classList.remove("is-loading");
    setTimeout(eventHandler, 100);
}

// 确保无论如何都会触发（兼容所有加载时序）
if (document.readyState === "complete" || document.readyState === "interactive") {
    // DOM 已就绪，直接执行
    setTimeout(removeLoading, 0);
} else {
    document.addEventListener("DOMContentLoaded", removeLoading);
    // 兜底：如果 DOMContentLoaded 也没触发，用 load 事件
    window.addEventListener("load", removeLoading);
}

// IE 检测
if (navigator.userAgent.match(/(MSIE|rv:11\.0)/)) {
    document.body.classList.add("is-ie");
}

//网页飘落效果
function eventHandler() {
	$('body').wpSuperSnow({
		flakes: ['./heheda/image/007.png', './heheda/image/006.png', './heheda/image/004.png',
			'./heheda/image/005.png', './heheda/image/001.png', './heheda/image/003.png',
			'./heheda/image/002.png', './heheda/image/008.png'
		],
		totalFlakes: '100',
		zIndex: '999999999',
		maxSize: '30',
		maxDuration: '50',
		useFlakeTrans: false
	});
}

//分享设置
function call() {
    navigator.share({
        title: document.title,
        url: window.location.href,
        text: '娃哈哈的工具箱'
    });
}

// 通知 — 使用新版 Promise API，仅允许时发送
if ("Notification" in window) {
    if (window.Notification.permission === "granted") {
        sendNotification();
    } else if (window.Notification.permission === "default") {
        window.Notification.requestPermission().then(function(permission) {
            if (permission === "granted") {
                sendNotification();
            }
        });
    }
}

function sendNotification() {
    new Notification("娃哈哈的小屋", {
        body: '久违了我的朋友，欢迎您的访问！',
        icon: './heheda/icon/128.png'
    });
}

// 标题判断
function istitle() {
	if (document.hidden) {
		//当窗口不可见
		document.title = '(つ ェ ⊂)我藏好了哦~';
	} else {
		//当窗口可见
		document.title = '(*゜ロ゜)ノ被发现了~';
		setTimeout("document.title='娃哈哈的小屋'", 3000);
	}
};
document.addEventListener('visibilitychange', istitle);

// 分享按钮 — 始终显示，无 share API 时降级为复制链接
document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById("cd-top");
    if (!el) return;
    // 如果浏览器不支持 navigator.share，点击时复制链接
    if (!navigator.share) {
        var shareBtn = el.querySelector('.share-text');
        if (shareBtn) shareBtn.textContent = '复制';
        el.onclick = function() {
            var url = window.location.href;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(function() {
                    alert('链接已复制: ' + url);
                });
            } else {
                // 降级：创建临时 input
                var input = document.createElement('input');
                input.value = url;
                input.style.position = 'fixed';
                input.style.opacity = '0';
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                alert('链接已复制: ' + url);
            }
        };
    }
});
