/**
 * 填充列表
 * @param  {Object} opts [配置]
 *                       opts.data 			Array		数据
 *                       opts.fn 			Function    处理每一条数据时的其它操作，传递一条数据
 *                       opts.removeNull	Boolean		是否移除空值dom的父元素，默认为false。(ps：当使用nullText时，该值必须为false)
 *                       opts.nullText		String 		当值为'',null,undefined时。显示的替换文本，默认为空。
 * @return {[type]}      [description]
 */
$.fn.list = function(opts) {
	var def = {
		removeNull: false,
		nullText: '空'
	}
	var config = $.extend({}, def, opts);
	return this.each(function(index, el) {
		var _this = el,
			$this = $(el),
			tpl = $this.find('.tpl'); //列表模板
		$this.empty().append(tpl);
		// 遍历列表数据
		for (var i = 0, j = data.length; i < j; i++) {
			var liData = data[i],
				li = tpl.clone().removeAttr('class'),
				elems = li.find('[data-name]');
			// 遍历需要填充数据的dom
			for (var n = 0, m = elems.length; n < m; n++) {
				var elem = elems.eq(n),
					keyArr = elem.attr('data-name').split(' '),
					val = liData[keyArr[0]];
				// 多层嵌套数据
				if (keyArr.length > 1) {
					// 遍历多层嵌套数据
					for (var k = 1, l = keyArr.length; k < l; k++) {
						val = val[keyArr[k]];
					}
				}
				if (val === '' || val === null || val === undefined) {
					if(config.removeNull){
						elem.parent().remove();
					}else{
						val = config.nullText;
						elem.html(val);
					}
				} else {
					elem.html(val);
				}
			}
			$this.append(li);
			// 填充列表时，其他操作
			if (config.fn) {
				config.fn(liData);
			}
		}
	});
}