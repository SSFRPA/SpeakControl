import { existsSync } from "https://deno.land/std@0.221.0/fs/mod.ts";

export function run(text) {
    ssf.Frame.init()
    if (!existsSync('./screenshot')) {
        Deno.mkdirSync("./screenshot", { recursive: true });
    }
    const img = ssf.Frame.to_image(20, 1000)
    img.save("./screenshot/" + Date.now().toString() + ".png")
}

