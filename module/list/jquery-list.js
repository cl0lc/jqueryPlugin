/**
 * 更具data-name属性填充列表
 * @param  {Object}   data [列表数据]
 * @param  {Function} fn   [其他操作]
 */
$.fn.list = function(data, fn){
	var list = $(this);
	var tpl = list.find('.tpl');

	list.empty().append(tpl);
	// 遍历列表数据
	for(var k = 0, l = data.length; k < l; k++){
		var liData = data[k];
		var li = tpl.clone().removeAttr('class');
		var elems = li.find('[data-name]');
		// 遍历要填充的dom
		for(var i = 0, j = elems.length; i < j; i++){
			var elem = elems.eq(i);
			var key = elem.attr('data-name');
			var val = '';
			// 当值为多层嵌套时
			if(key.indexOf(' ')  !== -1){
				var keyArr = key.split(' ');
				val = liData[keyArr[0]];
				for(var n = 1, m = keyArr.length; n < m; n++){
					val = val[keyArr[n]];
				}
			}else{
				val = liData[key];
			}
			// 如果值为空，去掉改行
			if(val === '' || val === undefined){
				elem.parent().remove();
			}else{
				elems[i].innerHTML = val;
			}
		}
		list.append(li);
		// 填充列表时，其他操作
		if(fn){
			fn(liData);
		}
	}
}