
function get_position(hwnd, src_img, target_img) {
    // const hwnd = app.native_window_handle()
    const screen_info = ssf.Frame.screen_info()
    const scale = 1920 / screen_info.width
    // const scale = 0.3; // 缩放比例,等比缩放能加快模板匹配的速度

    console.log(hwnd)
    ssf.Windows.switch_to_this_window(hwnd)
    //等待窗口切换
    ssf.Sys.sleep(200)
    //实时捕获一张图片,.可以使用while不停刷新屏幕获取图片
    const img = ssf.Frame.to_image(20, 1000)
    const info = img.info()
    img.resize(info.width * scale, info.height * scale)
    // img.save("d:\\test.png")
    //target为你的目标图像
    // const find_img=ssf.Image.load("./target.png");
    // find_img.save("d:\\test1.png")
    const find_info = target_img.info()
    target_img.resize(find_info.width * scale, find_info.height * scale)
    //0.99代表阈值,这边的取值越大越精准,最大不超过1
    const result = img.find(target_img, 0.99, 4)

    if (result.length > 0) {
        const originalX = result[0].x / scale;
        const originalY = result[0].y / scale;
        console.log(originalX, originalY)
    }
}


function set_foucs(hwnd, path) {
    ssf.Windows.set_foreground_window(hwnd);
    ssf.Windows.switch_to_this_window(hwnd);
    ssf.ElementExt.parse(hwnd, path, 2000).try_focus();
    ssf.Sys.sleep(200);
    ssf.Windows.show_window(hwnd, ssf.enums.CmdShow.SW_MAXIMIZE);
    // ssf.Windows.set_window_pos(hwnd,0,0,1920,1080,ssf.enums.WndInsertAfter.HWND_TOP,ssf.enums.SetwindowposFlags.SWP_SHOWWINDOW)

    ssf.Sys.sleep(200);
}

function recursiveTraversal(element, names, control_type) {
    if (element) {
        // console.log(element.name())
        // for (const name of names) {
        //     if (element.name().startsWith(name)) {
        if (control_type != "") {
            if (element.control_type().startsWith(control_type)) {
                console.log(element.control_type(), control_type);
                return element;
            }
        } else {
            return element;
        }
        //     }
        // }

        const children = element.childs();
        for (const child of children) {
            const foundElement = recursiveTraversal(child, names, control_type);
            if (foundElement !== null) {
                return foundElement;
            }
        }
    }
    return null;
}

export function auto_validation() {

    let chrome_app = null;
    try {
        chrome_app = ssf.ElementExt.find_task_bar("Edge", 1000);
    } catch (_) {
        //
    }

    const edge_hwnd = chrome_app.native_window_handle();
    const document = recursiveTraversal(chrome_app, "", "Document")
    // console.log(document.bounding_rectangle())
    set_foucs(edge_hwnd, "/");

    const tabinfo = ssf.Browser.current_tab(3000)
    // console.log(tabinfo)
    if (document && tabinfo && tabinfo.url.indexOf("www.youku.com///_____tmd_____/") > -1) {
        // const screen_info = ssf.Frame.screen_info()
        const chrome_pos = document.bounding_rectangle();
        // console.log(chrome_pos)
        const btn_pos = ssf.Browser.getPosition(tabinfo.id, '//*[@id="nc_1_n1z"]', 3000)
        // console.log(btn_pos)
        // console.log(btn_pos.x + btn_pos.w / 2,
        // btn_pos.y + btn_pos.h / 2,)
        ssf.Input.move(
            chrome_pos.x + btn_pos.x + btn_pos.w / 2,
            chrome_pos.y + btn_pos.y + btn_pos.h / 2,
            ssf.enums.Coordinate.Abs,
        );
        // ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Press)
        // ssf.Input.move(300,0,ssf.enums.Coordinate.Rel)
        // ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Release)
        // 示例：滑动300像素
        simulateFastSlide(200);
    }

}



// 更快速的 S 型缓动曲线（先加速，中间高速，最后减速）
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// 生成更快的滑动轨迹
function getFastSlideTrack(distance) {
    if (!Number.isInteger(distance) || distance <= 0) {
        throw new Error(`distance 必须是正整数: ${distance}`);
    }

    const track = [{ x: 0, y: 0, t: 0 }];
    let count = 20 + Math.floor(distance / 4); // 轨迹点减少，使速度更快
    let t = Math.floor(Math.random() * 20 + 30); // 初始时间减少

    let lastX = 0, lastY = 0;

    for (let i = 0; i < count; i++) {
        const progress = easeInOutQuad(i / count);
        let x = Math.round(progress * distance);
        let dx = x - lastX;

        if (dx === 0) continue; // 跳过无移动的点

        let y = 0; // 保持 Y 轴平稳，仅最后部分微调
        if (i > count * 0.8) {
            y = Math.random() < 0.2 ? 1 : 0;
        }

        t += Math.floor(Math.random() * 5 + 8); // 时间间隔减少，使滑动更快
        track.push({ x, y: lastY + y, t });

        lastX = x;
        lastY += y;
    }

    // 目标点微调
    for (let i = 0; i < 1; i++) {
        t += Math.floor(Math.random() * 15 + 5);
        track.push({ x: distance, y: lastY, t });
    }

    return track;
}

// 模拟快速滑动
function simulateFastSlide(distance) {
    const track = getFastSlideTrack(distance);

    // 按下鼠标
    ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Press);
    ssf.Sys.sleep(Math.floor(Math.random() * 30 + 50)); // 按下延迟减少

    let lastTime = 0;
    track.forEach((point, index) => {
        if (index === 0) return;

        let dx = point.x - track[index - 1].x;
        let dy = point.y - track[index - 1].y;
        let dt = point.t - lastTime;

        if (dx !== 0 || dy !== 0) {
            ssf.Input.move(dx, dy, ssf.enums.Coordinate.Rel);
        }

        if (dt > 0) {
            ssf.Sys.sleep(dt);
        }

        // 仅在 2% 情况下短暂停，避免滑动过于机械
        if (Math.random() < 0.02) {
            ssf.Sys.sleep(Math.floor(Math.random() * 20 + 10));
        }

        lastTime = point.t;
    });

    // 释放鼠标
    ssf.Input.button(ssf.enums.Button.Left, ssf.enums.Direction.Release);
    ssf.Sys.sleep(Math.floor(Math.random() * 50 + 30)); // 释放后延迟减少
}





// ssf.Browser.listen()
// auto_validation()