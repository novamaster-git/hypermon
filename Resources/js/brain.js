const AppInfo = {
  LOCALNAME: "CollectionList",
};
const { LOCALNAME } = AppInfo; // ! Your localstorage database name

class Collection {
  constructor(name) {
    this.id = Math.random().toString(36).substring(7);
    this.CollectionName = name;
    this.LinkList = [];
  }
}
class Links {
  constructor(title, link) {
    if (link.indexOf("http://") == 0 || link.indexOf("https://") == 0) {
      this.link = link;
    } else {
      this.link = "https://" + link.trim();
    }
    this.title = title;

    this.imgSrc = "";
  }
}

const ShowCollectionModal = () => {
  document
    .getElementById("CollectionmodalContainer")
    .classList.add("show-modal");
};
const HideCollectionModal = () => {
  document
    .getElementById("CollectionmodalContainer")
    .classList.remove("show-modal");
};
const HideLinkModal = () => {
  document
    .getElementById("NewLinkModalContainer")
    .classList.remove("show-modal");
};
const ShowLinkModal = (data) => {
  console.log(data);
  document.getElementById("NewLinkModalContainer").classList.add("show-modal");
  document.getElementById("LinkSaveBtn").setAttribute("data-id", data);
};
const GetIndexOfElement = (arrayName, objId) => {
  return FetchLocalStorage(arrayName).findIndex((obj) => obj.id === objId);
};

const SaveDataToLocal = (localName, data) => {
  localStorage.setItem(localName, JSON.stringify(data));
};
const FetchLocalStorage = (dbName) => {
  if (localStorage.getItem(dbName) === null) {
    localStorage.setItem(dbName, JSON.stringify([]));
  }
  var prevList = localStorage.getItem(LOCALNAME);
  var prevListJson = JSON.parse(prevList);
  return prevListJson;
};
const AddNewCollection = () => {
  var prevCollectionData = FetchLocalStorage(LOCALNAME);
  var CollectionName = document.getElementById("newCollectionName").value;
  var newCollectionObj = new Collection(CollectionName);
  prevCollectionData.push(newCollectionObj);
  localStorage.setItem(LOCALNAME, JSON.stringify(prevCollectionData));
  document.getElementById("newCollectionName").value = "";
  HideCollectionModal();
  window.location.reload();
};

const ContentLoad = () => {
  var SavedCollectionData = FetchLocalStorage(LOCALNAME);
  console.log(SavedCollectionData);
  var outputLinkList = "";
  var OutputString = "";
  var resultElements = SavedCollectionData.map((result) => {
    outputLinkList = "";
    result.LinkList.forEach((results, index) => {
      outputLinkList += `
       <div class="link-container">
            <p class="link-title">${results.title}</p>
            <p class="link-options">
              <i
                data-id="${index}"
                onclick="RemoveLinkFromCollection(this)"
                class="fa fa-trash-o remove"
                aria-hidden="true"
              ></i>
              <i
                data-id="${index}"
                class="fa fa-pencil"
                onclick="ShowEditModal(this)"
                aria-hidden="true"
              ></i>
              <i
                class="fa fa-clipboard hide-in-mobile"
                aria-hidden="true"
                data-link="${results.link}"
                onclick="CpyToClipboard(this)"
              ></i>
              <a
                style="text-decoration: none; color: black"
                href="${results.link}"
                target="_blank"
                ><i class="fa fa-external-link" aria-hidden="true"></i
              ></a>
            </p>
          </div>
              `;
    });
    TemplateString = `
        <div class="collection" id="${result.id}">
          <div class="collection-header">
            <div class="collection-title">${result.CollectionName}</div>
            <div class="collection-header-button">
              <i
                id="${result.id}"
                onclick="ShowLinkModal(this.id)"
                class="fa fa-plus-square-o"
                aria-hidden="true"
              ></i>
              <i
                id="${result.id}"
                onclick="DeleteCollectionById(this.id)"
                class="fa fa-trash-o"
                aria-hidden="true"
              ></i>
            </div>
          </div>
          ${outputLinkList}
        </div>
        `;
    return TemplateString;
  });
  resultElements.forEach((element) => {
    OutputString += element;
  });
  console.log(OutputString);
  document.getElementById("collection-container").innerHTML =
    OutputString === ""
      ? `<h1 style='font-family: "Mukta", sans-serif;'>There is no link</h1>`
      : OutputString;
};
document
  .getElementById("collection-container")
  .addEventListener("load", ContentLoad());

const addLinkById = (id, title, link, localName) => {
  const getObj = FetchLocalStorage(localName).find(
    (element) => element.id === id
  );
  const LinkObj = new Links(title, link);
  getObj.LinkList.push(LinkObj);
  const NewObj = getObj;
  return NewObj;
};

const SaveNewLink = (data) => {
  const objId = data.getAttribute("data-id");
  const getId = GetIndexOfElement(LOCALNAME, objId);
  const getObjects = FetchLocalStorage(LOCALNAME);
  const title = document.getElementById("newLinkTitle").value;
  const link = document.getElementById("newLink").value;
  getObjects[getId] = addLinkById(objId, title, link, LOCALNAME);
  SaveDataToLocal(LOCALNAME, getObjects);
  HideLinkModal();
  window.location.reload();
};
const DeleteCollectionById = (id) => {
  var con = confirm("Are you sure to delete the collection ?");
  if (con) {
    var index = GetIndexOfElement(LOCALNAME, id);
    var PrevData = FetchLocalStorage(LOCALNAME);
    PrevData.splice(index, 1);
    SaveDataToLocal(LOCALNAME, PrevData);
    window.location.reload();
  }
};
const CpyToClipboard = (data) => {
  const linktocopy = data.getAttribute("data-link");
  navigator.clipboard.writeText(linktocopy).then(
    function () {
      alert("Link Copy Success");
    },
    function (err) {
      console.error("Something is wrong");
    }
  );
};
const RemoveLinkFromCollection = (data) => {
  const userConfirm = confirm(`Are you Sure to delete this link ?`);
  if (userConfirm) {
    const index = data.getAttribute("data-id");
    const CollectionId =
      data.parentElement.parentElement.parentElement.getAttribute("id");
    var PrevData = FetchLocalStorage(LOCALNAME);
    var NewData = PrevData.map((result) => {
      if (result.id === CollectionId) {
        result.LinkList.splice(index, 1);
      }
      return result;
    });
    SaveDataToLocal(LOCALNAME, NewData);
    window.location.reload();
  }
};
const ShowEditModal = (data) => {
  const index = data.getAttribute("data-id");
  console.log(index, "INDEX");
  const CollectionId =
    data.parentElement.parentElement.parentElement.getAttribute("id");
  console.log(CollectionId, "Collection ID");
  var PrevData = FetchLocalStorage(LOCALNAME);
  var NewData = PrevData.map((result) => {
    if (result.id === CollectionId) {
      return result.LinkList[index];
    }
  });
  console.log(NewData[0], "none");
  document
    .getElementById("LinkUpdateBtn")
    .setAttribute("data-obj-id", CollectionId);
  document.getElementById("LinkUpdateBtn").setAttribute("data-index", index);
  document.getElementById("EditLinkTitle").value = NewData[0].title;
  document.getElementById("EditLink").value = NewData[0].link;
  document.getElementById("EditLinkModal").classList.add("show-modal");
};
const EditLink = (data) => {
  const index = data.getAttribute("data-index");
  const CollectionId = data.getAttribute("data-obj-id");
  var PrevData = FetchLocalStorage(LOCALNAME);
  var NewData = PrevData.map((result) => {
    if (result.id === CollectionId) {
      result.LinkList[index].title =
        document.getElementById("EditLinkTitle").value;
      result.LinkList[index].link = document.getElementById("EditLink").value;
    }
    return result;
  });
  SaveDataToLocal(LOCALNAME, NewData);
  window.location.reload();
};
const HideEditLinkModal = () => {
  document.getElementById("EditLinkModal").classList.remove("show-modal");
};

function generateBackup() {
  var text = FetchLocalStorage(LOCALNAME);
  download("backup.json", text);
  HideBackupModal();
}
function download(filename, text) {
  var element = document.createElement("a");
  element.style.display = "none";
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(text))
  );
  console.log(element);
  element.setAttribute("download", filename);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
const ShowRestoreModal = () => {
  document.querySelector("#RestoreModal").classList.add("show-modal");
};
const HideRestoreModal = () => {
  document.querySelector("#RestoreModal").classList.remove("show-modal");
};
const LoadDatatoLocal = (data) => {
  console.log("Workngsss");
  const fr = new FileReader();
  fr.onload = () => {
    localStorage.setItem(LOCALNAME, fr.result);
  };
  fr.readAsText(document.getElementById("RestoreFile").files[0]);
  console.log(document.getElementById("RestoreFile").files[0]);
  HideRestoreModal();
  window.location.reload();
};
const HideBackupModal = () => {
  document.getElementById("BackupModal").classList.remove("show-modal");
};
const ShowBackupModal = () => {
  document.getElementById("BackupModal").classList.add("show-modal");
};
