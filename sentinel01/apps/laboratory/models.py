from django.db import models
from django.forms import ModelForm
import time
# Create your models here.

# 重写students模型管理器
class SampleManager(models.Manager):
    # 过滤掉isDelete = 1的数据, 将isDelete = False的过滤出来
    def get_queryset(self):
        return super(SampleManager,self).get_queryset().filter(isde=False)

# 样本管理
class Sample(models.Model):
    # 表字段设计
    code = models.CharField(max_length=20, verbose_name='条形码',unique=True,error_messages = {'unique':'该条形码已存在，请重新输入或打开编辑功能！'}) # 不允许重复
    name = models.CharField(max_length=20,verbose_name='姓名')
    gend = models.CharField(max_length=20,verbose_name='性别')
    birt = models.DateField(null=True,verbose_name='出生日期')
    uids = models.CharField(max_length=20, null=True,verbose_name='证件号码')
    hist = models.CharField(max_length=20, null=True,verbose_name='现病史')
    fami = models.CharField(max_length=20, null=True,verbose_name='家族病史')
    diag = models.CharField(max_length=20, null=True,verbose_name='临床诊断')
    styp = models.CharField(max_length=20, verbose_name='样本类型')
    stat = models.CharField(max_length=20, verbose_name='样本状态')
    smar = models.CharField(max_length=200, null=True,verbose_name='样本备注')
    test = models.CharField(max_length=20, verbose_name='检测项目')
    dcol = models.DateField(null=True,verbose_name='采样日期')
    djoi = models.DateField(verbose_name='收样日期',auto_now_add=True) # auto_now_add为创建日期
    unit = models.CharField(max_length=20, verbose_name='送检单位')
    send = models.CharField(max_length=20, verbose_name='送检人')
    phon = models.CharField(max_length=20, verbose_name='手机号码')
    emai = models.CharField(max_length=20, null=True,verbose_name='电子邮箱')
    rtyp = models.CharField(max_length=20, default='电子报告', verbose_name='报告类型')
    rmar = models.CharField(max_length=200, null=True,verbose_name='备注信息')
    isde = models.BooleanField(default=False,verbose_name='是否删除') # 设置该字段用于软删除
    edit = models.DateField(null=True,auto_now=True,verbose_name='修改日期') # 自动更新当前时间
    esta = models.CharField(null=True,max_length=20,verbose_name='审核状态',default='未审核')
    # 通过实例化查询返回的字段，不加这个就会返回object，
    def __str__(self):
        return '%s-%s' %(self.code,self.name)
    # 创建新的管理器
    obj = SampleManager()
    # models属性设置
    class Meta:
        db_table = 'sample' # db_table是用于指定自定义数据库表名的'
        verbose_name = '样本管理' # 给你的模型类起一个更可读的名字
        ordering = ['id']  # 排序

# 后端表单验证，对条形码是否重复进行验证
class SampleForm(ModelForm):
    class Meta:
        model = Sample
        fields = ('code',)
        error_messages = {
            'code': {
                'unique':'该条形码已存在，请重新输入！',
            },
        }





class Test(models.Model):
    pass

class Report(models.Model):
    pass