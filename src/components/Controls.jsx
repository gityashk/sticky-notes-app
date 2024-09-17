import AddButton from "./AddButton";
import colors from "../assets/colors.json"
import Color from "./Color";

function Controls() {
    return (
        <div id="controls">
            <AddButton />
            {colors.map((color) => (
                <Color key={color.id} color={color} />
            ))}
        </div>
    )
}

export default Controls;