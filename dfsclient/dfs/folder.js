exports.newFolder=function(name, parentId){
    return {folderName : name, parent : parentId, childrenFolders : [], childrenFiles : []};
}
var newLinker = exports.newLinker=function(fileId, filename, linkType){
    return {id:fileId,name:filename,type:linkType};
}
exports.addFileToFolder=function(fileId, filename, parentFolder){
    parentFolder.childrenFiles.push(newLinker(fileId,filename,"file"));
}
exports.addFolderToFolder=function(folderId, folderName, parentFolder){
    parentFolder.childrenFolders.push(newLinker(folderId,folderName,"folder"));
}
exports.addLinkerToFolder=function(linker, parentFolder){
    if(linker.type == "folder"){
        parentFolder.childrenFolders = parentFolder.childrenFolders.filter(f=>f.id != linker.id);
        parentFolder.childrenFolders.push(linker);
    }
    else if(linker.type == "file"){
        parentFolder.childrenFiles = parentFolder.childrenFiles.filter(f=>f.id != linker.id);
        parentFolder.childrenFiles.push(linker);
    }
}
exports.setParentFolder=function(folder, parentFolderId){
    folder.parent = parentFolderId;
}
exports.saveFolder=function(folder, path){
    
}
exports.getChildren=function(parentFolder){
    var items = [];
    parentFolder.childrenFolders.forEach(element => {
        items.push(element);
    });
    parentFolder.childrenFiles.forEach(element => {
        items.push(element);
    });    
    return items;
}