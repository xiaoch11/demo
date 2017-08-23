var defaultUrl = 'http://house-be-manage.focus-test.cn/project/listProject?params=%7B%22page%22:0,%22count%22:10%7D';
//var defaultUrl = 'http://house-be-manage.focus-test.cn/project/listProject?params=%7B%22page%22:0,%22count%22:10,%22projName%22:%22*%22%7D'
var queryInputs = [{
    label: '省份',
    name: 'provinceId',
    type: 'select',
    additions: {
        options: [{value:1, showName:'北京'}, {value:2, showName:'天津'}, {value:3, showName:'河北'}, {value:4, showName:'山西'}, {value:5, showName:'内蒙古自治区'}],
        select: null
    }
},{
    label: '楼盘名称',
    name: 'projName',
    type: 'input',
    additions: {
        maxlength: '20',
        placeholder: '请输入楼盘名称'
    }
},{
    label: '楼盘ID',
    name: 'pid',
    type: 'input',
    additions: {
        maxlength: '20',
        placeholder: '请输入楼盘ID'
    }
},{
    label: '楼盘状态',
    name: 'state',
    type: 'select',
    additions: {
        options: [{value:1, showName:'显示'}, {value:0, showName:'隐藏'}]
    }
},{
    label: '来源',
    name: 'source',
    type: 'select',
    additions: {
        options: [{value:0, showName:'爬虫'}, {value:1, showName:'开发商'}, {value:2, showName:'个人线索'}]
    }
},{
    label: '责任人',
    name: 'creator',
    type: 'input',
    additions: {
        maxlength: 20,
        placeholder: '请输入责任人'
    }
}];
var currentQuery = {};


function url2query(url) {
    var str = url.split('?')[1];
    var query;
    query = str.split('&').reduce((obj, v) => {
        var parts = v.split('=');
        obj[parts[0]] = JSON.parse(decodeURIComponent(parts[1]));
        return obj;
    }, {});
    return query;
}

function query2url(url, query) {
    var str = url.split('?')[0] + '?';
    for (p in query) {
        str = str + p + '=' + encodeURIComponent(JSON.stringify(query[p])) + '&';
    }
    return str.substring(0, str.length - 1);
}

function resolveDataKeys(data) {
    var showKeys = {
        pid: '楼盘ID', 
        proj_name: '楼盘名称', 
        provinceName: '省', 
        cityName: '市', 
        create_time: '创建时间', 
        update_time: '更新时间',
        creator: '创建人',
        editor: '编辑者',
        state: '楼盘状态',
        source: '来源'
    };
    var keys = new Array();
    if (data) {
        var attr;
        for (attr in showKeys) {
            if (data.hasOwnProperty(attr)) {
                keys.push({
                    name: attr,
                    showName: showKeys[attr]
                })
            }
        }
    }
    return keys;
}

function resolveData(data) {
    for (var i = 0; i < data.length; i++) {
        var attr;
        for (attr in data[i]) {
            if (attr.match('time')) {
                var date = new Date(data[i][attr]);
                var Y = date.getFullYear();
                var M = (date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1);
                var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                data[i][attr] = Y + '-' + M + '-' + D;
            }
            else if(attr === 'source') {
                switch (data[i][attr]) {
                    case 0: data[i][attr] = '爬虫'; break;
                    case 1: data[i][attr] = '开发商'; break;
                    default: break;
                }
            }
        }
    }
    return data;
}

function getData(url) {
    url = url?url:defaultUrl;
    currentQuery = url2query(url);
    //console.log(query);
    return fetch(url, {
        mode: 'cors',
        credentials: 'include'
    }).then(function(res) {
        return res.json().then(function(res_json) {
            console.log(res_json);
            if (res_json.code > 0 && res_json.code == 500) {
                alert('服务器无响应');
            }
            if (res_json.data) {
                var response = {
                    currentPage: currentQuery.params.page + 1,
                    totalPages: Math.ceil(res_json.data.totalNum/currentQuery.params.count),
                    data: {
                        head: resolveDataKeys(res_json.data.content[0]),
                        body: resolveData(res_json.data.content)
                    }
                }
                return response;
            }
            else {
                var response = {
                    currentPage: 0,
                    totalPages: 0,
                    data: {
                        head: new Array(),
                        body: new Array()
                    }
                };
                return response; 
            }
        });
    }).catch(function(err) {
        console.error(err);
        return Promise.reject(err);
    });
}

window.addEventListener("load", function() {
    console.log("load");
    var promise = new Promise(function(resolve, reject) {
        resolve('Success');
    });

    promise.then(function() {
        console.log('getData');
        return getData();
    }).then(function(response) {
        //console.log(response);
        //var queryInputs = [{type:'select', additions:{}}, {type:'input', required:true, additions:{type:'text', maxlength:10, pattern:'[0-9]'}}];
        var t = new Table({}, response.data);
        var p = new Paginator({
            totalPages: response.totalPages,
            currentPage: response.currentPage,
            onPageChange: function(page) {
                console.log('onPageChange');
                currentQuery.params.page = page - 1;
                var url = query2url(defaultUrl, currentQuery);
                //console.log(url);
                var promiseGetData = new Promise(function(resolve, reject) {
                    resolve('Success');
                });
                promiseGetData.then(function() {
                    console.log('getData');
                    return getData(url);
                }).then(function(response) {
                    //console.log(response);
                    t.updateData(response.data);
                }, function(err) {
                    console.log(err);
                })
                //getData(url);
            }
        });
        var q = new QueryForm({
            onSubmit: function(params) {
                params['page'] = 0;
                params['count'] = 10;
                var query = {
                    params: params
                }
                var url = query2url(defaultUrl, query);
                var promiseGetData = new Promise(function(resolve, reject) {
                    resolve('Success');
                });
                promiseGetData.then(function() {
                    console.log('getData');
                    return getData(url);
                }).then(function(response) {
                    //console.log(response);
                    t.updateData(response.data);
                    p.options.totalPages = response.totalPages;
                    p.options.currentPage = response.currentPage;
                    p.setPage(response.currentPage);
                }, function(err) {
                    console.log(err);
                })
            }
        }, queryInputs);
        q.initQueryForm('queryForm');
        t.initTable('table');
        p.initPaginator('paginator');
    }, function(err) {
        console.error(err);
    });
    
});