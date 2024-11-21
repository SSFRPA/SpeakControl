
export function run(text) {
    const tid = ssf.Browser.current_tab(3000).id;
    ssf.Browser.remove_tab(tid, 3000)
}

