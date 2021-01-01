""" Test case base class """
import unittest

from underbudget import app, config, database


def clean_db(db_to_clean):
    """ Deletes all content in all tables of the given database """
    for table in reversed(db_to_clean.metadata.sorted_tables):
        db_to_clean.session.execute(table.delete())


class BaseTestCase(unittest.TestCase):
    """ Custom base test case """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.app = app.create_app(app_config=config.TestConfig)
        cls.db = database.db
        cls.db.init_app(cls.app)

    @classmethod
    def tearDownClass(cls):
        with cls.app.app_context():
            cls.db.drop_all()
        super().tearDownClass()

    def setUp(self):
        super().setUp()

        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        clean_db(self.db)

    def tearDown(self):
        self.db.session.rollback()
        self.app_context.pop()

        super().tearDown()
