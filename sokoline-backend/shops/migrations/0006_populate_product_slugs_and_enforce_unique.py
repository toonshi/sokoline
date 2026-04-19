from django.db import migrations, models
from django.utils.text import slugify

def gen_unique_slugs(apps, schema_editor):
    Product = apps.get_model('shops', 'Product')
    for product in Product.objects.all():
        if not product.slug:
            base_slug = slugify(product.name) or 'product'
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            product.slug = slug
            product.save()

class Migration(migrations.Migration):

    dependencies = [
        ('shops', '0005_tag_alter_category_options_remove_product_image_and_more'),
    ]

    operations = [
        # Step 1: Run Data Migration to fill slugs
        migrations.RunPython(gen_unique_slugs, reverse_code=migrations.RunPython.noop),

        # Step 2: Now enforce unique=True and null=False
        migrations.AlterField(
            model_name='product',
            name='slug',
            field=models.SlugField(blank=True, max_length=255, unique=True),
        ),
    ]
