const colors = [
    { r: 255, g: 99, b: 71 }, { r: 255, g: 165, b: 0 }, { r: 255, g: 105, b: 180 },
    { r: 70, g: 130, b: 180 }, { r: 255, g: 222, b: 173 }, { r: 60, g: 179, b: 113 },
    { r: 255, g: 69, b: 0 }, { r: 255, g: 255, b: 255 }, { r: 255, g: 255, b: 0 },
    { r: 135, g: 206, b: 235 }, { r: 0, g: 191, b: 255 }, { r: 147, g: 112, b: 219 },
    { r: 139, g: 69, b: 19 }, { r: 238, g: 130, b: 238 }, { r: 255, g: 20, b: 147 },
    { r: 75, g: 0, b: 130 }, { r: 240, g: 230, b: 140 }, { r: 255, g: 99, b: 71 },
    { r: 0, g: 128, b: 0 }, { r: 255, g: 69, b: 0 }, { r: 255, g: 182, b: 193 },
    { r: 72, g: 61, b: 139 }, { r: 240, g: 128, b: 128 }, { r: 255, g: 228, b: 225 },
    { r: 32, g: 178, b: 170 }, { r: 85, g: 107, b: 47 }, { r: 255, g: 239, b: 148 },
    { r: 210, g: 105, b: 30 }, { r: 173, g: 216, b: 230 }, { r: 139, g: 0, b: 0 },
    { r: 255, g: 99, b: 71 }, { r: 255, g: 215, b: 0 }, { r: 102, g: 205, b: 170 },
    { r: 255, g: 182, b: 193 }, { r: 255, g: 223, b: 186 }, { r: 233, g: 150, b: 122 },
    { r: 255, g: 218, b: 185 }, { r: 123, g: 104, b: 238 }, { r: 240, g: 230, b: 140 },
    { r: 255, g: 160, b: 122 }, { r: 100, g: 149, b: 237 }, { r: 50, g: 205, b: 50 },
    { r: 255, g: 99, b: 71 }, { r: 255, g: 255, b: 0 }, { r: 102, g: 205, b: 170 },
    { r: 255, g: 105, b: 180 }, { r: 0, g: 128, b: 0 }, { r: 255, g: 69, b: 0 },
    { r: 240, g: 230, b: 140 }, { r: 173, g: 216, b: 230 }, { r: 144, g: 238, b: 144 },
    { r: 255, g: 182, b: 193 }, { r: 139, g: 69, b: 19 }, { r: 238, g: 130, b: 238 },
    { r: 255, g: 20, b: 147 }, { r: 75, g: 0, b: 130 }, { r: 240, g: 128, b: 128 },
    { r: 255, g: 228, b: 225 }, { r: 32, g: 178, b: 170 }, { r: 85, g: 107, b: 47 },
    { r: 255, g: 239, b: 148 }, { r: 210, g: 105, b: 30 }, { r: 173, g: 216, b: 230 },
    { r: 139, g: 0, b: 0 }, { r: 240, g: 128, b: 128 }, { r: 255, g: 228, b: 225 },
    { r: 32, g: 178, b: 170 }, { r: 85, g: 107, b: 47 }, { r: 255, g: 239, b: 148 },
    { r: 210, g: 105, b: 30 }, { r: 173, g: 216, b: 230 }, { r: 139, g: 0, b: 0 },
    { r: 255, g: 69, b: 0 }, { r: 255, g: 182, b: 193 }, { r: 72, g: 61, b: 139 },
    { r: 240, g: 128, b: 128 }, { r: 255, g: 228, b: 225 }, { r: 32, g: 178, b: 170 },
    { r: 85, g: 107, b: 47 }, { r: 255, g: 239, b: 148 }, { r: 210, g: 105, b: 30 },
    { r: 173, g: 216, b: 230 }, { r: 139, g: 0, b: 0 }, { r: 255, g: 99, b: 71 },
    { r: 255, g: 215, b: 0 }, { r: 102, g: 205, b: 170 }, { r: 255, g: 182, b: 193 },
    { r: 255, g: 223, b: 186 }, { r: 233, g: 150, b: 122 }, { r: 255, g: 218, b: 185 },
    { r: 123, g: 104, b: 238 }, { r: 240, g: 230, b: 140 }, { r: 255, g: 160, b: 122 },
    { r: 100, g: 149, b: 237 }, { r: 50, g: 205, b: 50 }, { r: 255, g: 99, b: 71 },
    { r: 255, g: 255, b: 0 }, { r: 102, g: 205, b: 170 }, { r: 255, g: 105, b: 180 },
    { r: 0, g: 128, b: 0 }, { r: 255, g: 69, b: 0 }, { r: 240, g: 230, b: 140 },
    { r: 173, g: 216, b: 230 }, { r: 144, g: 238, b: 144 }, { r: 255, g: 182, b: 193 },
    { r: 139, g: 69, b: 19 }, { r: 238, g: 130, b: 238 }, { r: 255, g: 20, b: 147 },
    { r: 75, g: 0, b: 130 }, { r: 240, g: 128, b: 128 }, { r: 255, g: 228, b: 225 },
    { r: 32, g: 178, b: 170 }, { r: 85, g: 107, b: 47 }
];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

export async  function print(text,timeout=5000) {
    const screen_info= ssf.Frame.screen_info()
    const dpi=1.0;
    const color=colors[6];
    // console.log(screen_info.width,screen_info)
    const log_rect={

        // x: 0,
        // y: 0,
        x: Math.floor(screen_info.width /2/dpi)-400,
        y: Math.floor(screen_info.height/dpi- 200),
        width: 800,
        height: 100,
        r: color.r,
        g: color.g,
        b: color.b,
        text:text,
        a:0.7,
        font_size:30,
        delay: timeout,
        id:1,
        border_only:false,
    }
    const det_data=[]

    det_data.push(log_rect)
    // console.log(JSON.stringify(det_data) )
    const data={
        "is_focus":false,
        "scroll_y": 0,
        "detData":  det_data,
        "restart":false
    }
  
     const requestModel= {
        url: 'http://127.0.0.1:51515/det_data',
        header: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        timeout: 5000 // 5秒超时
      };
      await  ssf.Request.post([requestModel]);


}


export async  function log(text,timeout=5000) {
    if (globalThis.current_mode&&globalThis.current_mode.mode=="睡眠模式") {
        return;
        
    }
    const screen_info= ssf.Frame.screen_info()
    const dpi=1.0;
    const color=colors[3];
    // console.log(screen_info.width,screen_info)
    const log_rect={

        // x: 0,
        // y: 0,
        x: Math.floor(screen_info.width /2/dpi)-400,
        y: Math.floor(screen_info.height/dpi- 200),
        width: 800,
        height: 100,
        r: color.r,
        g: color.g,
        b: color.b,
        text:text,
        a:0.5,
        font_size:30,
        delay: timeout,
        id:1,
        border_only:false,
    }
    const det_data=[]

    det_data.push(log_rect)
    // console.log(JSON.stringify(det_data) )
    const data={
        "is_focus":false,
        "scroll_y": 0,
        "detData":  det_data,
        "restart":false
    }
  
     const requestModel= {
        url: 'http://127.0.0.1:51515/det_data',
        header: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        timeout: 5000 // 5秒超时
      };
      await  ssf.Request.post([requestModel]);


}
