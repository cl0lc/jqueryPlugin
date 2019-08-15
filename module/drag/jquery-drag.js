/**
 * 拖动
 * 	ps: 要想将面板控制在指定内容器移动，面板和容器在定位关系就必须得是相对关系
 * @param  {Object} opts [description]
 *     opts.handle 拖动行为触发dom的选择器
 *     opts.container 拖动范围限制的dom的选择器，默认body.
 * @return {[type]}      [description]
 */
$.fn.drag = function(opts){
	var def = {
		container: 'body'
	};
	var config = $.extend({}, def, opts);
	return this.each(function(index, el) {
		var panel = $(el),
			handle = $(config.handle),
			container = $(config.container),
			state = false,
			x = 0,
			y = 0;
		handle.css('cursor', 'move');
		handle.mousedown(function(e){
			var position = panel.position();
			state = true;
			x = e.pageX - position.left;
			y = e.pageY - position.top;
		}).mouseup(function(){
			state = false;
		});

		$(document).mousemove(function(e){
			if(!state) return;
			var nl = e.pageX - x,
				nt = e.pageY - y;
			if(nl < 0){
				nl = 0;
			}
			if(nl > container.width() - panel.width() - 2){
				nl = container.width() - panel.width() - 2;
			}
			if(nt < 0){
				nt = 0;
			}
			if(nt > container.height() - panel.height() - 2){
				nt = container.height() - panel.height() - 2;
			}
			panel.css({
				left: nl,
				top: nt
			});
		}).mouseup(function(e){
			state = false;
		});;
	});
}