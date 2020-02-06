from django.conf.urls import url
from . import views

app_name = 'laboratory'
urlpatterns = {
    # 网页访问
    url(r'^sampleList/$', views.sampleList, name='sampleList'),
    url(r'^sampleList/addSample/$', views.addSample, name='addSample'),
    url(r'^testList/$', views.testList, name='testList'),
    url(r'^testList/addTest$', views.addTest, name='addTest'),
    url(r'^testList/addGene$', views.addGene, name='addGene'),
    url(r'^reportList/$', views.reportList, name='reportList'),
    # 业务处理接口
    url(r'^sampleList/get$', views.sampleList_get, name='sampleList_get'),
    url(r'^sampleList/delete$', views.sampleList_delete, name='sampleList_delete'),
    url(r'^sampleList/check$', views.sampleList_check, name='sampleList_check'),

}