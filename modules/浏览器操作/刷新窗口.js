
export function run(text) {
    const tid = ssf.Browser.current_tab(3000).id;
    ssf.Browser.reload(tid, 3000)
}

