export function run(text){
    ssf.Input.key(ssf.enums.KeyCode.Control, ssf.enums.Direction.Press)
    ssf.Input.key(ssf.enums.KeyCode.C, ssf.enums.Direction.Press)
    ssf.Sys.sleep(50)
    ssf.Input.key(ssf.enums.KeyCode.Control, ssf.enums.Direction.Release)
    ssf.Input.key(ssf.enums.KeyCode.C, ssf.enums.Direction.Release)
    return -1
}