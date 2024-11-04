from fastapi import APIRouter, HTTPException
from api.database import db
from api.model.document import Document
from bson import ObjectId

router = APIRouter()

@router.post("/documents")
async def create_document(document: Document):
    document_dict = document.dict()
    result = db.documents.insert_one(document_dict)
    if result.inserted_id:
        document_dict["_id"] = str(result.inserted_id)
        return document_dict
    raise HTTPException(status_code=400, detail="Erreur lors de l'enregistrement du document.")

@router.put("/documents/{document_id}")
async def update_document(document_id: str, document: Document):
    document_dict = document.dict()
    result = db.documents.update_one({"_id": ObjectId(document_id)}, {"$set": document_dict})
    if result.modified_count == 1:
        return {"message": "Document mis à jour avec succès."}
    raise HTTPException(status_code=404, detail="Document non trouvé.")

@router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    result = db.documents.delete_one({"_id": ObjectId(document_id)})
    if result.deleted_count == 1:
        return {"message": "Document supprimé avec succès."}
    raise HTTPException(status_code=404, detail="Document non trouvé.")

@router.get("/documents/{document_id}")
async def read_document(document_id: str):
    document = db.documents.find_one({"_id": ObjectId(document_id)})
    if document:
        document['_id'] = str(document['_id'])
        return document
    raise HTTPException(status_code=404, detail="Document non trouvé.")

@router.get("/documents")
async def read_documents():
    documents = db.documents.find()
    return [{"id": str(doc["_id"]), "title": doc["title"], "content": doc["content"]} for doc in documents]
