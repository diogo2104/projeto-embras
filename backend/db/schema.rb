# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_21_121826) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "estados", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "descricao"
    t.string "sigla"
    t.datetime "updated_at", null: false
  end

  create_table "publicidade_estados", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "estado_id", null: false
    t.bigint "publicidade_id", null: false
    t.datetime "updated_at", null: false
    t.index ["estado_id"], name: "index_publicidade_estados_on_estado_id"
    t.index ["publicidade_id"], name: "index_publicidade_estados_on_publicidade_id"
  end

  create_table "publicidades", force: :cascade do |t|
    t.string "botao_link"
    t.datetime "created_at", null: false
    t.text "descricao"
    t.date "dt_fim"
    t.date "dt_inicio"
    t.datetime "encerrada_em"
    t.string "titulo"
    t.string "titulo_botao_link"
    t.datetime "updated_at", null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "publicidade_estados", "estados"
  add_foreign_key "publicidade_estados", "publicidades"
end
