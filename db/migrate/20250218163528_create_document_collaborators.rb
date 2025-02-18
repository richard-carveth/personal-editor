class CreateDocumentCollaborators < ActiveRecord::Migration[8.0]
  def change
    create_table :document_collaborators do |t|
      t.string :role
      t.references :user, null: false, foreign_key: true
      t.references :document, null: false, foreign_key: true

      t.timestamps
    end
  end
end
