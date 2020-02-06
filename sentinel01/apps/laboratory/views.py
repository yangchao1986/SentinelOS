from django.shortcuts import render
from django.http import JsonResponse
import time,re # re是正则匹配函数，用于正则替换
from .models import Sample,SampleForm
from django.core import serializers
import json
from django import forms # 用于前端表单验证

# 样本管理--视图
def sampleList(request):
    return render(request,'laboratory/sampleList.html')

from django.db.models import Q
# 按照layui表格数据源格式返回--接口
def sampleList_get(request):
    page = int(request.GET.get('page'))
    limit = int(request.GET.get('limit'))
    code = request.GET.get('code')
    name = request.GET.get('name')
    state = request.GET.get('state')
    if not None in (code,name):
        '''
        1.多条件查询方式一
        search_dict={}
        if code:
            search_dict['code'] = code
        if name:
            search_dict['name'] = name
        s = Sample.obj.all().filter(**search_dict) # 获取总数
        2.多条件查询方式二
        s = Sample.obj.all().filter(Q(code__icontains=code) | Q(name__icontains=name))  # 这个多条件查询必须两个都有值
        '''
        '''多条件查询方式三,这个适合模糊查询'''
        search_dict = {}
        if code:
            search_dict['code__icontains'] = code #__contains包含某个字段查询，__icontains加上i就是忽略大小写
        if name:
            search_dict['name__icontains'] = name
        if state:
            search_dict['esta__icontains'] = state
        s = Sample.obj.all().filter(**search_dict)  # 获取过滤后的条目
    else:
        s = Sample.obj.all()
    n = len(s) # 获取总条目数
    s = s[(page-1)*limit:page*limit] # 获取分页数
    s = serializers.serialize('json',s)
    s = json.loads(s,encoding='utf-8')
    data = []
    i = 0
    while i < len(s):
        data.append(s[i]['fields'])
        i+=1
    content = {'code':0,'msg':'成功','count':n,'data':data}
    return JsonResponse(content, content_type="application/json",safe=False)

# 删除选定数据数据--接口
def sampleList_delete(request):
    codes = request.GET.getlist('codes[]')
    # 循环执行将isde的值改成1，软链接删除
    for code in codes:
        ls = Sample.obj.filter(code=code)
        for s in ls:
            s.isde = True
            s.save()
    return JsonResponse({'success': 200, 'msg': '删除成功！'}, content_type='text/html')

# 审核数据接口
def sampleList_check(request):
    code = request.GET.get('code')
    state = request.GET.get('state')
    ls = Sample.obj.get(code=code)
    try:
        # ls.esta = time.strftime("%Y-%m-%d", time.localtime())
        ls.esta = state
        ls.save()
        return JsonResponse({'success': 200, 'msg': '审核成功！'}, content_type='text/html',charset='utf-8')
    except Exception as e:
        print(e)
        return JsonResponse({'success': 201, 'msg': '审核失败！'}, content_type='text/html', charset='utf-8')


def addSample(request):
    if request.method == 'POST':
        obj =  SampleForm(request.POST)
        if obj.is_valid():
            # print(request.POST.get('uids'))
            # print(request.POST.get('code'))
            # for k,v in request.POST.items():
            #     print(k +':'+ v)
            # print('输出')
            # print(request.POST)
            # 增加数据到数据库
            s = Sample()
            s.code = request.POST.get('code')
            s.name = request.POST.get('name')
            s.gend = request.POST.get('gend')
            if request.POST.get('birt') =='':
                s.birt = '1900-01-01'
            else:
                s.birt = request.POST.get('birt')
            s.uids = request.POST.get('uids')
            s.hist = request.POST.get('hist')
            s.fami = request.POST.get('fami')
            s.diag = request.POST.get('diag')
            s.styp = request.POST.get('styp')
            s.stat = request.POST.get('stat')
            s.smar = request.POST.get('smar')
            s.test = request.POST.get('test')
            if request.POST.get('dcol')=='':
                s.dcol = '1900-01-01'
            else:
                s.dcol = request.POST.get('dcol')
            s.djoi = request.POST.get('djoi')
            s.unit = request.POST.get('unit')
            s.send = request.POST.get('send')
            s.phon = request.POST.get('phon')
            s.emai = request.POST.get('emai')
            # 将报告类型拼接成：电子报告/检测结果的形式保存
            s.rtyp = request.POST.get('rtyp[d]', '') + '/' + request.POST.get('rtyp[z]',
                                                                              '') + '/' + request.POST.get(
                'rtyp[t]', '')
            s.rtyp = re.sub('^//|//$|^/|/$', '', s.rtyp)
            s.rtyp = re.sub('//', '/', s.rtyp)

            s.rmar = request.POST.get('rmar')
            s.isde = False
            s.save()
            return JsonResponse({'success': '200', 'msg': '提交成功'}, content_type='text/html')  # 返回json格式
        else:
            return JsonResponse({'success': '201', 'msg': obj.errors["code"][0]}, content_type='text/html')
    if request.method == 'GET':
        return render(request, 'laboratory/addSample.html')




# 实验管理
def testList(request):
    return render(request,'laboratory/testList.html')

# 核酸提取
def addTest(request):
    return render(request,'laboratory/addTest.html')

# 基因检测
def addGene(request):
    return render(request,'laboratory/addGene.html')

# 报告管理
def reportList(request):
    return render(request,'laboratory/reportList.html')