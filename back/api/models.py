from django.db import models
from django.contrib.auth.models import AbstractUser



class User(AbstractUser):
    """Общая модель пользователя"""

    fio = models.CharField(("ФИО"), max_length=255)
    phoneNumber = models.CharField(("Номер телефона"), max_length=20)
    avatar = models.ImageField(
        ("Аватар пользователя"), 
        upload_to='avatars', 
        blank=True, 
        null=True, 
        height_field=None, 
        width_field=None, 
        max_length=None
    )



class LegalEntity(models.Model):
    """Юр. лицо"""

    name = models.CharField(("Наименование юридиеского лица"), max_length=100)
    head = models.CharField(("Руководитель"), max_length=100, blank=True, null=True)
    legalAddress = models.CharField(("Юридический адрес"), max_length=255)
    actualAddress = models.CharField(("Фактический адрес"), max_length=255)
    phone = models.CharField(("Телефон"), max_length=20, blank=True, null=True)
    mail = models.CharField(("E-mail"), max_length=30, blank=True, null=True)
    INN = models.CharField(("ИНН/КПП"), max_length=50)
    settlementAccount = models.CharField(("Расчётный счёт"), max_length=50, blank=True, null=True)
    correspondentAccount = models.CharField(("Корреспондентский счёт"), max_length=50, blank=True, null=True)
    bank = models.CharField(("Банк"), max_length=50, blank=True, null=True)
    bik = models.CharField(("БИК"), max_length=50, blank=True, null=True)

    balance = models.DecimalField(("Баланс"), max_digits=15, decimal_places=2, default=0)
    totalInvoicedSum = models.DecimalField(
        ("Сумма выставленных счетов"),
        max_digits=15,
        decimal_places=2,
        default=0
    )

    sawatzky = models.BooleanField(("Относится к Sawatzky"), default=False)

    status = models.BooleanField(("Статус контрагента"), default=True, blank=True, null=True)
    prepayment = models.BooleanField(("Работа по предоплате"), default=False, blank=True, null=True)
    workObjectsGroup = models.ForeignKey(
        "api.WorkObjectsGroup",
        verbose_name=("Группы рабочих объектов"),
        related_name='client',
        on_delete=models.CASCADE,
        blank=True,
        null=True)
    workObject = models.ForeignKey(
        "api.WorkObject",
        verbose_name=("Рабочий объект"),
        on_delete=models.CASCADE,
        related_name='client',
        blank=True,
        null=True
    )
    workTaskGroups = models.ManyToManyField("api.WorkTaskGroup",
                                            verbose_name=("Предоставляемые группы услуг"),
                                            blank=True, null=True)
    workMaterialGroups = models.ManyToManyField("api.WorkMaterialGroup",
                                                verbose_name=("Предоставляемые группы материалов"),
                                                blank=True, null=True)


    class Meta:
        verbose_name = "Юр. Лицо"
        verbose_name_plural = "Юр. Лица"


    def __str__(self):
        return f"{self.id}: {self.name} "



class Employee(models.Model):
    """Расширение модели пользователя"""

    ROLES = (
        ('admin', 'Администратор'),
        ('initiator', 'Инициатор'),
        ('dispatcher', 'Диспетчер'),
    )

    GROUPS = (
        ('S1', 'Управляющий Объекта'),
        ('S2', 'Руководитель Отдела Управления'),
        ('S3', 'Исполнительный директор'),
        ('S4', 'Руководство'),
        ('S5', 'Администратор системы'),
        ('S6', 'Разработчик системы'),
    )

    legalEntity = models.ForeignKey(LegalEntity, verbose_name=("Юридическое лицо"), on_delete=models.CASCADE)
    user = models.OneToOneField(User, verbose_name=("Пользователь"), on_delete=models.CASCADE, related_name='employee')
    role = models.CharField(choices=ROLES, default='user', max_length=20, verbose_name='Роль пользователя')
    group = models.CharField(choices=GROUPS, default='S1', max_length=20, verbose_name='Группа пользователя')
    status = models.BooleanField(("Статус"), default=True)
    powerOfAttorney = models.FileField(upload_to='power_of_attorneys', verbose_name='Доверенность', null=True, blank=True, default=None)


    class Meta:
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"

    def __str__(self):
        return f"{self.user.id}: {self.user.fio}"



class WorkObjectsGroup(models.Model):
    """Группа рабочих объектов"""

    name = models.CharField(("Наименование группы"), max_length=512)
    workObjects = models.ManyToManyField("api.WorkObject", verbose_name=("Список объектов"), related_name='workObjectsGroup', blank=True, null=True)
    

    class Meta:
        verbose_name = ("Группа объектов")
        verbose_name_plural = ("Группы объектов")

    def __str__(self):
        return self.name
    

class WorkObject(models.Model):
    """Рабочий объект"""

    name = models.CharField(("Наименование группы"), max_length=512)
    code = models.CharField(("Код объекта"), max_length=512)
    contractNumber = models.CharField(("Номер договора"), max_length=512)
    address = models.CharField(("Адрес объекта"), max_length=512)

    class Meta:
        verbose_name = ("Рабочий объект")
        verbose_name_plural = ("Рабочие объекты")

    def __str__(self):
        return self.name


class WorkTaskGroup(models.Model):
    """ Группа услуг """

    name = models.CharField(("Наименование группы услуг"), max_length=255)
    tasks = models.ManyToManyField(
        "api.WorkTask", 
        verbose_name=("Список услуг входящих в эту группу"), 
        blank=True, 
        related_name='workTaskGroup'
    )

    class Meta:
        verbose_name = "Группа услуг"
        verbose_name_plural = "Группы услуг"

    def __str__(self):
        return self.name
    
    
class WorkTask(models.Model):
    """ Работы проводимые на объекте """

    name = models.CharField(("Наименование работы"), max_length=50)
    price = models.FloatField(("Цена"))
    time = models.IntegerField(("Рекомендованный срок выполнения работ"))
    # summ = models.FloatField(("Сумма"))
    status = models.BooleanField(("Статус услуги"), default=True)

    class Meta:
        verbose_name = "Проводимая работа"
        verbose_name_plural = "Проводимые работы"

    def __str__(self):
        return self.name
    


class WorkMaterialGroup(models.Model):
    """ Группа материалов """

    name = models.CharField(("Наименование группы материалов"), max_length=50)
    materials = models.ManyToManyField(
        "api.WorkMaterial", 
        verbose_name=("Список материалов входящих в эту группу"), 
        blank=True, 
        related_name='workMaterialGroup'
    )

    class Meta:
        verbose_name = "Группа материалов"
        verbose_name_plural = "Группы материалов"

    def __str__(self):
        return self.name



class WorkMaterial(models.Model):
    """ Рабочие материалы для проведения работ """

    name = models.CharField(("Наименование работы"), max_length=50)
    price = models.FloatField(("Цена"))
    count = models.IntegerField(("Рекомендованное количество материала для выполнения работ"))
    # summ = models.FloatField(("Сумма"))
    status = models.BooleanField(("Статус материала"), default=True)

    class Meta:
        verbose_name = "Рабочий материал"
        verbose_name_plural = "Рабочие материалы"

    def __str__(self):
        return self.name



class ApplicationWorkTask(models.Model):
    """Промежуточная таблица с actualTime"""

    application = models.ForeignKey("api.Application", on_delete=models.CASCADE, )
    workTask = models.ForeignKey(WorkTask, on_delete=models.CASCADE)
    actualTime = models.PositiveIntegerField(("Актуальное время"), null=True, blank=True)

    def __str__(self):
        return f'application №{self.application.id} workTask №{self.workTask.id}'



class ApplicationWorkMaterial(models.Model):
    """Промежуточная таблица с actualCount"""

    application = models.ForeignKey("api.Application", on_delete=models.CASCADE)
    workMaterial = models.ForeignKey(WorkMaterial, on_delete=models.CASCADE)
    actualCount = models.PositiveIntegerField(("Действительное количество"), null=True, blank=True)

    def __str__(self):
        return f'application №{self.application.id} workMaterial №{self.workMaterial.id}'



class ApplicationPerformer(models.Model):
    """Промежуточная таблица для связи заявок с исполнителями"""

    PRIORITIES = (
        ('urgent', 'Срочно'),
        ('notUrgent', 'Не срочно'),
    )

    STATUSES = (
        ('accepted', 'Принял'),
        ('notAccepted', 'Не принял'),
        ('declined', 'Отказался'),
        ('completed', 'Выполнил'),
    )

    application = models.ForeignKey("api.Application", on_delete=models.CASCADE)
    performer = models.ForeignKey("api.SawatzkyEmployee", on_delete=models.CASCADE)
    priority = models.CharField(("Приоритет"), choices=PRIORITIES, default='urgent', max_length=20)
    status = models.CharField(("Стаус"), choices=STATUSES, default='notAccepted', max_length=20)
    dateSent = models.DateTimeField(("Дата отправки"), auto_now_add=True)
    dateAccepted = models.DateTimeField(("Дата принятия"), null=True, auto_now=False, auto_now_add=False)
    dateDeclined = models.DateTimeField(("Дата отказа"), null=True, auto_now=False, auto_now_add=False)

    def __str__(self):
        return f'application №{self.application.id} performer №{self.performer.id}'



class ApplicationJournal(models.Model):
    """Промежуточная таблица для связи заявок с журналом"""

    application = models.ForeignKey("api.Application", on_delete=models.CASCADE)
    general_journal = models.ForeignKey("api.GeneralJournal", on_delete=models.CASCADE)
    totalPayment = models.DecimalField(("Сумма оплаты"), max_digits=15, decimal_places=2, default=0)
    totalDebt = models.DecimalField(("Сумма долга"), max_digits=15, decimal_places=2, default=0)


    def __str__(self):
        return f'application №{self.application.id} generalJournal №{self.general_journal.id}'



class Application(models.Model):
    """Заявка на выполнение работ"""

    STATUSES = [
        ("new", 'Создана'),
        ('processed', 'Обрабатывается'),
        ('coordination', 'На согласовании у заказчика'),
        ('paymentCoordination', 'Ожидается оплата'),
        ('inWork', 'Передано исполнителю'),
        ('waitingFinish', 'Ожидает подтверждения завершения'),
        ('finished', 'Выполнено'),
        ('rejected', 'Отклонена'),
    ]

    title = models.CharField(("Заголовок заявки"), max_length=150)
    subject = models.CharField(("Предмет запроса"), max_length=300, blank=True, null=True)
    description = models.CharField(("Описание заявки"), max_length=300, blank=True, null=True)
    creator = models.ForeignKey("api.Employee", verbose_name=("Создатель заявки"), on_delete=models.CASCADE, blank=True, null=True, related_name='applicationCreator')
    performers = models.ManyToManyField(
        "api.SawatzkyEmployee",
        through="ApplicationPerformer",
        verbose_name=("Исполнители"),
        blank=True,
        null=True,
        related_name='application'
    )
    workTasks = models.ManyToManyField(
        "api.WorkTask",
        through="ApplicationWorkTask",
        verbose_name=("Проводимые работы"),
        blank=True,
        null=True,
        related_name='applications'
    )
    workMaterials = models.ManyToManyField(
        "api.WorkMaterial",
        through="ApplicationWorkMaterial",
        verbose_name=("Материалы для работы"),
        blank=True,
        null=True,
        related_name='applications'
    )
    documents = models.ManyToManyField("api.Document", verbose_name=("Документы"), blank=True, null=True, related_name='application_documents')
    place = models.CharField(("Место выполнения заявки"), max_length=100, blank=True, null=True )

    totalSum = models.FloatField(("Общая стоимость работ"), blank=True, null=True, default=0)
    percent = models.FloatField(("НДС"), blank=True, null=True)
    totalSumWithPercent = models.FloatField(("Общая стоимость работ с НДС"), blank=True, null=True)
    totalPayment = models.DecimalField(("Сумма оплаты"), max_digits=15, decimal_places=2, blank=True, null=True, default=0)
    totalDebt = models.DecimalField(("Сумма долга"), max_digits=15, decimal_places=2, blank=True, null=True, default=0)


    status = models.CharField(("Статус заявки"), max_length=50, blank=False, choices=STATUSES, default='new')
    step = models.PositiveIntegerField(("Шаг выполнения заявки"), default=1)

    createdAt = models.DateField(("Дата создания заявки"), auto_now=False, auto_now_add=True)
    updatedAt = models.DateField(("Последняя дата изменения"), auto_now=True, auto_now_add=False)
    startWorkDate = models.DateField(("Дата начала проведения работ"), auto_now=False, auto_now_add=False)
    endWorkDate = models.DateField(("Дата окончания проведения работ"), auto_now=False, auto_now_add=False)
    actualWorkDate = models.DateField(("Фактическая дата выполнения запроса"), auto_now=False, auto_now_add=False,
                                      blank=True, null=True)
    logs = models.ManyToManyField("api.Log", verbose_name=("Журнал"),
                                      blank=True, null=True, related_name='application_logs')
    comments = models.ManyToManyField("api.Comments", verbose_name=("Комментарии"),
                                      blank=True, null=True, related_name='application_comments')
    sawatzkyComments = models.ManyToManyField("api.Comments", verbose_name=("Комментарии пользователей Sawatzky"),
                                      blank=True, null=True, related_name='application_sawatzky')

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self):
        return self.title



class Report(models.Model):
    """Отчет"""

    PRIORITIES = (
        ('urgent', 'Срочно'),
        ('notUrgent', 'Не срочно'),
    )

    legalEntity = models.ForeignKey(LegalEntity, verbose_name=("Заказчик в рамках которого создается отчет"), on_delete=models.CASCADE, blank=True, null=True)
    creator = models.ForeignKey("api.SawatzkyEmployee", verbose_name=("Сотрудник, создавший отчет"), blank=True, null=True, on_delete=models.CASCADE)

    workObjectsGroup = models.ForeignKey('api.WorkObjectsGroup', verbose_name=("Группа рабочих объектов"), on_delete=models.CASCADE, blank=True, null=True)
    workObject = models.ForeignKey('api.WorkObject', verbose_name=("Рабочий объект"), on_delete=models.CASCADE,blank=True, null=True)

    foundedApllications = models.ManyToManyField(Application, verbose_name=("Найденные заявки"), related_name='report')

    periodStart = models.DateField(("Период поиска заявок от"), auto_now=False, auto_now_add=False)
    periodEnd = models.DateField(("Период поиска заявок до"), auto_now=False, auto_now_add=False)

    createdAt = models.DateField(("Дата создания"), auto_now=False, auto_now_add=True)
    updatedAt = models.DateField(("Последняя дата изменения"), auto_now=True, auto_now_add=False)

    priority = models.CharField(("Приоритет"), choices=PRIORITIES, default='urgent', max_length=20)
    description = models.CharField(("Описание отчета"), max_length=300, blank=True, null=True)
    status = models.BooleanField(("Статус отчета"), default=False)

    application_status = models.CharField(("Статус заявки"), max_length=50, blank=True, null=True)

    class Meta:
        verbose_name = ("Отчет")
        verbose_name_plural = ("Отчеты")

    def __str__(self):
        return self.priority



class Document(models.Model):
    """Документы"""

    DOC_TYPE_CHOICES = [
        ("act", "Акт"),
        ("powerOfAttorney", "Доверенность"),
        ("paymentSlip", "Платежка"),
        ("other", "Прочее"),
        ("confirmation", "Подтверждение"),
    ]

    name = models.CharField(("Наименование документа"), max_length=150)
    docType = models.CharField(("Тип документа"), choices=DOC_TYPE_CHOICES, max_length=32)
    createdAt = models.DateField(("Дата добавления документа"), auto_now=False, auto_now_add=True)
    file = models.FileField(("Файл документа"), upload_to='documents/', blank=True, null=True, default=1)
    signed = models.BooleanField(("подписан/не подписан"), default=False)

    class Meta:
        verbose_name = ("Документ")
        verbose_name_plural = ("Документы")

    def __str__(self):
        return self.name



class SawatzkyEmployee(models.Model):
    """Пользователь Sawatzky"""

    ROLES = (
        ('admin', 'Администратор'),
        ('dispatcher', 'Диспетчер'),
        ('performer', 'Исполнитель'),
        ('dispatcherPerformer', 'Диспетчер/Исполнитель'),
    )

    GROUPS = (
        ('S1', 'Управляющий Объекта'),
        ('S2', 'Руководитель Отдела Управления'),
        ('S3', 'Исполнительный директор'),
        ('S4', 'Руководство'),
        ('S5', 'Администратор системы'),
        ('S6', 'Разработчик системы'),
    )

    user = models.OneToOneField(User, verbose_name=("Пользователь"), on_delete=models.CASCADE, related_name='sawatzky_employee')
    position = models.CharField(("Должность"), max_length=100)
    workObjectGroup = models.ForeignKey(WorkObjectsGroup, verbose_name=("Группа рабочих объектов"), on_delete=models.CASCADE)
    workObject = models.ForeignKey(WorkObject, verbose_name=("Рабочий объект"), on_delete=models.CASCADE)
    workingObjects = models.ManyToManyField(WorkObject, verbose_name=("Обслуживаемые объекты"), related_name='sawatzky_employees')
    status = models.BooleanField(("Статус"), default=True)

    role = models.CharField(choices=ROLES, default='user', max_length=20, verbose_name='Роль пользователя Sawatzky')
    group = models.CharField(choices=GROUPS, default='S1', max_length=20, verbose_name='Группа пользователя Sawatzky')
    class Meta:
        verbose_name = "Сотрудник Sawatzky"
        verbose_name_plural = "Сотрудники Sawatzky"

    def __str__(self):
        return (f"{self.user.fio} - {self.position} "
                f"- {self.workObjectGroup} - {self.workObject} "
                f"- {self.workingObjects} - {self.status}")




class Log(models.Model):
    """Журнал изменений заявки"""

    application = models.ForeignKey(Application, verbose_name=("Заявка"), on_delete=models.CASCADE)
    changer = models.ForeignKey(User, verbose_name=("Кто изменил"), on_delete=models.CASCADE)
    whatChange = models.CharField(("Какое изменении"), max_length=300)
    changeDate = models.DateTimeField(("Дата изменения заявки"), null=True)

    class Meta:
        verbose_name = "Журнал"
        verbose_name_plural = "Журналы"

    def __str__(self):
        return f"Изменения в заявке {self.application.title} - {self.changeDate} - {self.whatChange}"




class Comments(models.Model):
    """Комментарии к заявке"""

    creator = models.ForeignKey(User, verbose_name=("Создатель комментария"), on_delete=models.CASCADE)
    created_at = models.DateTimeField(("Дата создания"), auto_now_add=True)
    description = models.CharField(("Описание"), max_length=300)

    class Meta:
        verbose_name = "Комментарий"
        verbose_name_plural = "Комментарии"

    def __str__(self):
        return f"Комментарий от {self.creator.fio} - {self.created_at}"


class GeneralJournal(models.Model):
    """Генеральный журнал"""

    STATUSES = [
        ("fully", 'Полностью'),
        ('partially', 'Частично'),
        ('unpaid', 'Неоплаченная')
    ]

    paymentDocumentNumber = models.CharField(("Номер платежного документа"), max_length=100)
    legalEntity = models.ForeignKey(LegalEntity, verbose_name=("Контрагент"), on_delete=models.CASCADE)
    receiptDate = models.DateField(("Дата поступления"))
    totalAmount = models.DecimalField(("Общая сумма"), max_digits=15, decimal_places=2)
    amountByInvoices = models.DecimalField(("Сумма по счетам"), max_digits=15, decimal_places=2, blank=True, null=True)
    status = models.CharField(("Статус оплаты"), max_length=50, blank=False, choices=STATUSES, default='unpaid')
    # application = models.ForeignKey(Application, verbose_name=("Заявка"), on_delete=models.CASCADE, blank=True, null=True)
    application = models.ManyToManyField(Application, through='ApplicationJournal', verbose_name=("Заявки"), blank=True)
    totalDebt = models.DecimalField(("Сумма долга"), max_digits=15, decimal_places=2, blank=True, null=True)
    totalPayment = models.DecimalField(("Сумма оплаты"), max_digits=15, decimal_places=2, blank=True, null=True)

    class Meta:
        verbose_name = "Генеральный журнал"
        verbose_name_plural = "Генеральные журналы"

    def __str__(self):
        return f"{self.paymentDocumentNumber} - {self.legalEntity.name}"