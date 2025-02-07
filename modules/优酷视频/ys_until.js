
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



