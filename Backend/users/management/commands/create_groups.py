from django.core.management.base import BaseCommand
from django.apps import apps


class Command(BaseCommand):
    help = "Creates user groups for Agrivision with proper roles"

    def handle(self, *args, **options):
        # Lazy-load Group model (avoids migration timing issues)
        Group = apps.get_model('auth', 'Group')

        # Define default groups
        group_names = ["GeneralPublic", "Student", "Staff", "Admin"]

        for name in group_names:
            group, created = Group.objects.get_or_create(name=name)
            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Created group: {name}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️ Group already exists: {name}"))

        self.stdout.write(self.style.SUCCESS("🎯 All groups verified and ready!"))
