import './ColorSelector.css'

// eslint-disable-next-line react/prop-types
export default function ColorSelector({setBoxes, id}){
    const handleClick= (color) => {
        const colors = {
            'blue' : '#2662E4',
            'red' : '#E42626',
            'pink' : '#E426DB',
            'green' : '#5AB298',
            'purple' : '#6C26E4',
            'orange' : '#E48326',
        }
        setBoxes((prevBoxes) => {
            return prevBoxes.map(box =>
                box.id === id ? {...box, color: colors[color]} : box
            );
        });
    }

    return <div className="selector-container">
        <div className="red selector" onClick={() => handleClick("red")}></div>
        <div className="orange selector" onClick={() => handleClick("orange")}></div>
        <div className="green selector" onClick={() => handleClick("green")}></div>
        <div className="blue selector" onClick={() => handleClick("blue")}></div>
        <div className="purple selector" onClick={() => handleClick("purple")}></div>
        <div className="pink selector" onClick={() => handleClick("pink")}></div>
    </div>
}
