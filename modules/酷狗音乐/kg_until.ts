//自定义一个搜索任务栏 避免出现2个同名的不同窗口
export function find_task_bar2(name, name2, timeout_ms) {
    const startTime = Date.now();
    // console.log(name)

    // while (true) {
    const root_ele = ssf.ElementExt.get_root_element();
    // console.log(root_ele)
    const foundChild = root_ele.childs().find((child) =>
        child.name().indexOf(name) >= 0 && child.name().indexOf(name2) == -1
    );
    if (foundChild) {
        return foundChild;
    }

    const elapsedTime = Date.now() - startTime;

    if (elapsedTime >= timeout_ms) {
        throw new Error("Element search timed out");
    }

    //     ssf.Sys.sleep(200);
    // }
}

export function recursiveTraversal_value(element, values, control_type) {
    if (element) {
        console.log(element.name());
        for (const name of values) {
            console.log(element.value(), name);
            if (element.value().startsWith(name)) {
                if (control_type != "") {
                    if (element.control_type().startsWith(control_type)) {
                        console.log(element.control_type(), control_type);
                        return element;
                    }
                } else {
                    return element;
                }
            }
        }

        const children = element.childs();
        for (const child of children) {
            const foundElement = recursiveTraversal(
                child,
                values,
                control_type,
            );
            if (foundElement !== null) {
                return foundElement;
            }
        }
    }
    return null;
}

export function recursiveTraversal(element, names, control_type) {
    if (element) {
        // console.log(element.name())
        for (const name of names) {
            if (element.name().startsWith(name)) {
                if (control_type != "") {
                    if (element.control_type().startsWith(control_type)) {
                        // console.log(element.control_type(), control_type);
                        return element;
                    }
                } else {
                    return element;
                }
            }
        }

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

export function det_text(main_ele: ssf.WinElement, search_text: string) {
    const screen_info = ssf.Frame.screen_info();
    let scale = 1920 / screen_info.width;
    //进行缩放有效避免计算量过大 注意directml后续会优化性能 目前directml在多线程中表现较差
    if (scale >= 1) {
        scale = 0.5;
    }

    const screen_img = ssf.Frame.to_image(20, 1000);

    screen_img.resize(screen_info.width * scale, screen_info.height * scale);

    const window_rect = main_ele.bounding_rectangle();
    // console.log(window_rect);
    const crop_img = screen_img.crop_imm(
        window_rect.x * scale,
        window_rect.y * scale,
        window_rect.w * scale,
        window_rect.h * scale,
    );
    crop_img.save("d:\\1.png");

    const r = ssf.ai.OCR.parse(crop_img);
    let result = [];
    r.forEach((element) => {
        // console.log(element)
        if (element.text.indexOf(search_text) > -1) {
            // console.log("找到")
            // return element
            result.push({
                x: element.x / scale,
                y: element.y / scale,
                w: element.w / scale,
                h: element.h / scale,
                id: element.id,
            });
        }
    });
    return result;
}

// ssf.Frame.init();
