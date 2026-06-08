// 主题音乐播放器 — 纯自动播放：HTML 内嵌静音 helper + JS 过渡
(function () {
    var bgmUrl = "./heheda/audio/bgm.mp3";
    var ap = null;

    document.addEventListener("DOMContentLoaded", function () {
        var helper = document.getElementById('bgm-helper');

        ap = new APlayer({
            container: document.getElementById("player3"),
            mini: false,
            autoplay: false,
            loop: "all",
            order: "list",
            preload: "auto",
            volume: 0.4,
            mutex: true,
            lrcType: 0,
            listFolded: true,
            listMaxHeight: 180,
            audio: [
                {
                    name: "呐呐呐",
                    artist: "AC娘本体",
                    url: bgmUrl,
                    cover: "https://p2.music.126.net/33D6FmhWrHdmOQ_K7iTPYA==/109951169136663937.jpg"
                },
                {
                    name: "本地音乐 ②",
                    artist: "未知",
                    url: "./heheda/audio/2.mp3",
                    cover: "https://p2.music.126.net/diXRlQW2zDRoPd7A1ZaMUg==/109951168506953455.jpg"
                }
            ]
        });

        // 如果 helper 已经静音播放中，解除静音并切换到 APlayer
        if (helper && !helper.paused) {
            // 先让 helper 以 0.4 音量正常播
            helper.muted = false;
            helper.volume = 0.4;
            // APlayer 启动并静音，然后切过来
            ap.play();
            ap.volume(0);
            // 等 APlayer 开始播后杀掉 helper
            var checkAp = setInterval(function () {
                if (ap.audio && !ap.audio.paused) {
                    clearInterval(checkAp);
                    ap.volume(0.4);
                    helper.remove();
                }
            }, 100);
            // 超时保护：3 秒后无论如何切
            setTimeout(function () {
                clearInterval(checkAp);
                ap.volume(0.4);
                if (helper.parentNode) helper.remove();
            }, 3000);
        } else {
            // 兜底：尝试直接播
            var p = ap.play();
            if (p && p.catch) {
                p.catch(function () {
                    // 最后一次尝试：如果有 helper 就强行播
                    if (helper) {
                        helper.muted = false;
                        helper.play();
                    }
                });
            }
        }

        // ---- Drawer ----
        var drawer = document.getElementById('player3-drawer');
        if (!drawer) return;
        drawer.addEventListener('click', function(e) {
            if (!drawer.classList.contains('pinned')) {
                drawer.classList.add('pinned');
                e.stopPropagation();
            }
        });
        document.addEventListener('click', function() {
            drawer.classList.remove('pinned');
        });

        // ---- 强制透明所有白色/浅色背景 ----
        var p3 = document.getElementById('player3');
        if (!p3) return;

        function makeTransparent() {
            var all = p3.querySelectorAll('*');
            all.forEach(function(el) {
                var tag = el.tagName.toLowerCase();
                if (tag === 'input' || tag === 'button' || tag === 'img' || tag === 'svg' || tag === 'canvas') return;
                var cs = window.getComputedStyle(el);
                var bg = cs.backgroundColor;
                if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                    var m = bg.match(/[\d.]+/g);
                    if (m && m.length >= 3) {
                        var r = parseInt(m[0]), g = parseInt(m[1]), b = parseInt(m[2]);
                        if ((r > 200 && g > 200 && b > 200) || (r === g && g === b && r > 180)) {
                            el.style.setProperty('background-color', 'transparent', 'important');
                        }
                    }
                }
            });
        }

        setTimeout(makeTransparent, 300);
        setTimeout(makeTransparent, 800);
    });
})();