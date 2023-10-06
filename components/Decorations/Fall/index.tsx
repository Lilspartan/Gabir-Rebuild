import { useEffect, useState } from 'react';

const Fall = () => {
    const [doEffects, setDoEffects] = useState(false);

	const makeLeaf = () => {
		var x = Math.floor(Math.random() * window.innerWidth);
		var leaf = Math.floor(Math.random() * 3) + 1;
		var animTime = Math.random() * 11
		var zIndex = Math.round(Math.random());
		if (animTime < 6) animTime = 6;

		var span = document.createElement('span');
		span.className = "fall-leaf"
		var img = document.createElement('img');
		img.src = `/img/fall/leaf${leaf}.webp`;
		img.style.left = x + "px";
		img.style.animationDuration = animTime + "s"
		img.style.zIndex = String(zIndex)
		img.style.setProperty("--rotate1", String(Math.floor(Math.random() *61) - 30) + "deg");
		img.style.setProperty("--rotate2", String(Math.floor(Math.random() *61) - 30) + "deg");
		img.style.setProperty("--rotate3", String(Math.floor(Math.random() *61) - 30) + "deg");
		img.style.setProperty("--wobble1", String(Math.floor(Math.random() *61) - 30) + "px");
		img.style.setProperty("--wobble2", String(Math.floor(Math.random() *61) - 30) + "px");
		img.style.setProperty("--wobble3", String(Math.floor(Math.random() *61) - 30) + "px");
		span.appendChild(img)
		var leaves = document.getElementById("leaves")
		leaves?.appendChild(span);
		var innerLeaves = leaves?.getElementsByClassName("fall-leaf")
		if ((innerLeaves ? innerLeaves.length : 0 ) > 40) {
			if (innerLeaves) innerLeaves[0].remove();
		}

		setTimeout(makeLeaf, Math.random() * 5000)
	}

	useEffect(() => {
        // let localEffects = localStorage.getItem("show-effects");

        // if (localEffects !== null && localEffects === "true") {
        
        // }  

        if (window.innerWidth >= 750) {
            makeLeaf();
        }
	}, [])

	return (
		<div id = "leaves" className = "max-w-screen">
            
		</div>
	)
}

export default Fall;