"""Initial migration

Revision ID: bb38a05f5353
Revises: 
Create Date: 2021-02-13 15:38:59.579337

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bb38a05f5353'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ledger',
    sa.Column('created', sa.DateTime(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('currency', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('account_category',
    sa.Column('created', sa.DateTime(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ledger_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.ForeignKeyConstraint(['ledger_id'], ['ledger.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('envelope_category',
    sa.Column('created', sa.DateTime(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ledger_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.ForeignKeyConstraint(['ledger_id'], ['ledger.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transaction',
    sa.Column('created', sa.DateTime(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ledger_id', sa.Integer(), nullable=False),
    sa.Column('transaction_type', sa.Enum('income', 'refund', 'opening_balance', 'expense', 'transfer', 'allocation', 'reallocation', name='transactiontype'), nullable=False),
    sa.Column('recorded_date', sa.Date(), nullable=False),
    sa.Column('payee', sa.String(length=256), nullable=False),
    sa.ForeignKeyConstraint(['ledger_id'], ['ledger.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('account',
    sa.Column('created', sa.DateTime(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('institution', sa.String(length=256), nullable=False),
    sa.Column('account_number', sa.String(length=256), nullable=False),
    sa.Column('archived', sa.Boolean(), nullable=False),
    sa.Column('external_id', sa.String(length=256), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['account_category.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('envelope',
    sa.Column('created', sa.DateTime(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('archived', sa.Boolean(), nullable=False),
    sa.Column('external_id', sa.String(length=256), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['envelope_category.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('account_transaction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('transaction_id', sa.Integer(), nullable=False),
    sa.Column('account_id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Integer(), nullable=False),
    sa.Column('memo', sa.String(length=256), nullable=False),
    sa.Column('cleared', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['account_id'], ['account.id'], ),
    sa.ForeignKeyConstraint(['transaction_id'], ['transaction.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('envelope_transaction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('transaction_id', sa.Integer(), nullable=False),
    sa.Column('envelope_id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Integer(), nullable=False),
    sa.Column('memo', sa.String(length=256), nullable=False),
    sa.ForeignKeyConstraint(['envelope_id'], ['envelope.id'], ),
    sa.ForeignKeyConstraint(['transaction_id'], ['transaction.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('envelope_transaction')
    op.drop_table('account_transaction')
    op.drop_table('envelope')
    op.drop_table('account')
    op.drop_table('transaction')
    op.drop_table('envelope_category')
    op.drop_table('account_category')
    op.drop_table('ledger')
    # ### end Alembic commands ###
