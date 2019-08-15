/**
 * 分页插件
 * @param {Object} opts [分页配置]
 * @param {String} opts.id [模板id]
 * @param {Boolean} opts.serve [是否开启后端分页，false表示前端分页]
 * @param {Object} opts.ajax [开始后端分页后，ajax请求的配置]
 * @param {String | Array} opts.data [当opts.serve为true时，为返回数据里表示渲染数据的字段名，当为false时，表示渲染数据]
 * @param {Number} opts.limit [每页数量]
 * @param {Number} opts.pageBtnNum [页码数量]
 * @param {Object} opts.pageBtnText [页面按钮上的文字描述]
 */
$.fn.pagination = function (opts) {

  // 默认配置
  let def = {
    serve: true,
    limit: 15,
    data: 'result',
    pageBtnNum: 7,
    pageBtnText: {
      first: '首页',
      last: '尾页',
      prev: '上一页',
      next: '下一页'
    }
  }

  // 最终配置
  let config = $.extend({}, def, opts)

  return this.each(function (index, el) {

    let list = $(el) // 列表
    let pageCount = 0 // 总页数

    /**
     * 获取当前页面数据，并渲染出列表个分页按钮
     * @param {Number} pageNo [页码] 
     */
    let getData = function (pageNo) {
      let data = []
      // 开始后端分页
      if (config.serve) {
        // 修改参数里的请求参数
        ajax.data['pageNo'] = pageNo
        $.ajax({
          type: ajax.type || "POST",
          dataType: "json",
          url: ajax.url,
          data: ajax.data,
          success: function (res) {
            if (res.state === 200) {
              data = res[config.count]
              pageCount = Math.ceil(data.length / config.limit)
            } else {
              alert(res.msg)
            }
          }
        });
      } else {
        let limit = config.limit
        let allData = config.data
        data = allData.slice((pageNo - 1) * limit, pageNo * limit)
        pageCount = Math.ceil(allData.length / limit)
      }
      initList(data)
      initPaginationBtn(pageNo, pageCount)
    }

    /**
     * 渲染列表
     * @param {Array} res [列表数据] 
     */
    let initList = function (res) {
      list.empty()
      // 移除标签之间的空格
      let tmpl = $(config.tmpl).html().trim().replace(/>(\s)*</g, '><')
      // 匹配{{}}之间的值
      let result = tmpl.match(/{{[A-z]+}}/g)
      // 遍历数据
      for (let i = 0, j = res.length; i < j; i++) {
        let data = res[i]
        let li = tmpl
        // 遍历模板，并替换模板为实际数据
        for (let n = 0, m = result.length; n < m; n++) {
          let keyStr = result[n] // 数据模板
          let key = keyStr.replace(/{{|}}/g, '') // 移除{{}}双括号
          let val = data[key] // 数据模板对应的实际数据
          li = li.replace(keyStr, val) // replace并不会改变字符串，而是返回新字符串
        }
        list.append(li)
      }
    }

    /**
     * 渲染分页按钮列表
     * @param {Number} pageNo     [当前页]
     * @param {Number} pageCount  [总页数]
     */
    let initPaginationBtn = function (pageNo, pageCount) {
      let pageBtns = $('.pageBtn')

      // 第一次渲染时，添加页码按钮
      if (pageBtns.length < 1) {
        let paginationBtnContainer = $('<div class="pagination"></div>') // 分页按钮容器
        let btnNum = 0 // 页码数量
        if (pageCount <= config.pageBtnNum) {
          // 当总页数小于设定值时
          btnNum = pageCount
        } else {
          // 当总页数大于设定值时
          btnNum = config.pageBtnNum
        }
        // 添加页码按钮
        for (let i = 0, j = btnNum; i < j; i++) {
          paginationBtnContainer.append($('<button class="pageBtn"></button>'))
        }
        // 添加首页、尾页、上一页、下一页
        let first = $('<button class="first">' + config.pageBtnText.first + '</button>')
        let last = $('<button class="last">' + config.pageBtnText.last + '</button>')
        let prev = $('<button class="prev">' + config.pageBtnText.prev + '</button>')
        let next = $('<button class="next">' + config.pageBtnText.next + '</button>')
        // 首页
        first.on('click', function () {
          getData(1)
        })
        // 尾页
        last.on('click', function () {
          getData(pageCount)
        })
        // 上一页
        prev.on('click', function () {
          let pageNo = +$('.pageBtn.active').html()
          if (pageNo <= 1) return
          getData(--pageNo)
        })
        // 下一页
        next.on('click', function () {
          let pageNo = +$('.pageBtn.active').html()
          if (pageNo >= pageCount) return
          getData(++pageNo)
        })
        paginationBtnContainer.prepend(prev)
        paginationBtnContainer.prepend(first)
        paginationBtnContainer.append(next)
        paginationBtnContainer.append(last)
        // 在列表后面添加分页按钮
        list.after(paginationBtnContainer)
        pageBtns = $('.pageBtn')
        // 页码
        pageBtns.on('click', function () {
          // 点击当前页时返回
          if ($(this).hasClass('active')) return
          let pageNo = +$(this).html()
          getData(pageNo)
        })
      }

      // 渲染页码按钮
      let startPageNo = 0
      // 总页数小于页码数量
      if (pageCount <= config.pageBtnNum) {
        startPageNo = 1
      } else {
        let m = Math.ceil(config.pageBtnNum / 2)
        if (pageNo <= m) {
          startPageNo = 1
        } else if (pageNo <= pageCount - m + 1) {
          startPageNo = pageNo - 3
        } else {
          startPageNo = pageCount - config.pageBtnNum + 1
        }
      }


      // 第一个按钮页码不变时
      $('.pageBtn.active').removeClass('active')
      pageBtns.each(function (i, e) {
        let no = startPageNo + i
        $(e).html(no)
        if (pageNo === no) {
          $(e).addClass('active')
        }
      })
    }

    getData(1)
  })
}