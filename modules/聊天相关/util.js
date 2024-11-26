
export function move_abs_click(rect, button,direction) {
    ssf.Input.move(rect.x + rect.w / 2, rect.y + rect.h / 2, ssf.enums.Coordinate.Abs)
    ssf.Input.button(button, direction)
}