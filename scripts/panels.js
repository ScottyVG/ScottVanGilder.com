(function(){
	
	window.addEventListener('load', Init);

	function Init(){
		BindParallax();
	}

	function BindParallax(){
		window.addEventListener('scroll', UpdateParallax);
		UpdateParallax();
	}
	function UpdateParallax(){
		var panels = document.querySelectorAll('.panel');
	
		for(var i=0,panel; panel=panels[i++];)
			panel.style.top = CalculatePanelTop(panel);
	}
	function CalculatePanelTop(panel){
		var y = window.scrollY,
				height = window.innerHeight;
	
		var diff = (panel.offsetTop) - (y);
				percent = diff / height,
				give = (panel.offsetHeight/height) / 2;

		if(percent < -panel.offsetHeight/height - give || percent > 1 + give) return;
	
		panel.querySelector('.img').style.top = percent*250 + 'px';
	}
	
})();