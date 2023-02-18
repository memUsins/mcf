const deleteDuplicateInArray = (filtered, includes) => filtered.filter(i => !includes.includes(i));
const toggleClass = (element, className, addClass) => element?.classList.toggle(className, addClass);
const hasClass = (element, className) => element?.classList.contains(className);
const defaultClasses = {
  active: 'active',
  hidden: 'hidden',
  find: 'find',
  selected: 'selected',
  remove: 'remove',
  delete: 'delete',
  collector: {
    parentLayer: 'parent-layer',
    childrenLayer: 'children-layer',
    subChildrenLayer: 'sub-children-layer'
  }
};
const defaultAttributes = {
  dataId: 'data-id',
  dataValue: 'data-value',
  dataTabTitle: 'data-tab-title'
};
const getAllElements = (selector, parent) => parent ? parent.querySelectorAll(selector) : document.querySelectorAll(selector);
const getElement = (selector, parent) => parent ? parent.querySelector(selector) : document.querySelector(selector);
const getParent = (item, selector) => item.closest(selector);
const getMatchesParent = (item, selector, selector2) => item.closest(selector) || item.matches(selector2 ? selector2 : selector);
const cloneElement = element => element.cloneNode(true);
const addLast = (list, element) => list[list.length - 1].after(element);
const removeElement = (cardClass, removeButtonClass) => {
  console.log(cardClass, removeButtonClass);
  const triggers = getAllElements(removeButtonClass);
  if (!triggers) return;
  console.log(triggers);
  const removeHandler = e => getParent(e.target, cardClass).remove();
  setManyListener(triggers, removeHandler);
};
const setManyListener = (list, func) => {
  list.forEach(item => {
    item.removeEventListener('click', func);
    item.addEventListener('click', func);
  });
};
const setText = (element, text) => element.innerHTML = text;
const setId = (element, id) => element.id = id;
const setAttribute = (element, attribute, text) => element.setAttribute(attribute, text);
const replaceText = (element, needle, replaceValue) => element.replace(needle, replaceValue);
const transformString = string => {
  return string.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^a-zа-яё0-9\s]/gi, ' ');
};
const translit = word => {
  const wordList = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ь: '',
    ы: 'y',
    ъ: '',
    э: 'e',
    ю: 'yu',
    я: 'ya'
  };
  let response = '';
  word = word.toLowerCase().trim();
  for (let i = 0; i < word.length; ++i) {
    if (wordList[word[i]] === undefined) response += word[i];else response += wordList[word[i]];
  }
  return response.replace(/ /gi, '_');
};
const initContractor = parent => {
  const isContractorButton = getAllElements('input[name="is-contractor"]', parent || undefined);
  const organisationBlock = getElement('.organisation');
  const buttonHandler = e => {
    const target = e.target;
    if (target.value === 'true') toggleClass(organisationBlock, defaultClasses.hidden, false);else toggleClass(organisationBlock, defaultClasses.hidden, true);
  };
  setManyListener(isContractorButton, buttonHandler);
};
initContractor();
const initEmployee = parent => {
  const addTrigger = getElement('.add-employee', parent || undefined);
  if (!addTrigger) return;
  const removeEmployeeHandler = e => getParent(e.target, '.employee__item').remove();
  const addEmployeeHandler = e => {
    const target = e.target;
    const parent = getParent(target, '.employee__list');
    const items = getAllElements('.employee__item', parent);
    const reference = items[0];
    const dataId = items.length + 1;
    const newItem = cloneElement(reference);
    addLast(items, newItem);
    niceSelectBind(newItem);
    const removeButton = getElement('.delete-employee', newItem);
    toggleClass(removeButton, defaultClasses.hidden, false);
    setAttribute(newItem, defaultAttributes.dataId, dataId);
    const passportTabTitle = getElement('.passport-tab-title', newItem);
    const passportTabBody = getElement('.passport-tab-body', newItem);
    const certificateTabTitle = getElement('.certificate-tab-title', newItem);
    const certificateTabBody = getElement('.certificate-tab-body', newItem);
    setAttribute(newItem, defaultAttributes.dataId, dataId);
    setAttribute(passportTabTitle, defaultAttributes.dataTabTitle, dataId);
    setAttribute(passportTabBody, defaultAttributes.dataTabTitle, dataId);
    setAttribute(certificateTabTitle, defaultAttributes.dataTabTitle, dataId);
    setAttribute(certificateTabBody, defaultAttributes.dataTabTitle, dataId);
    const tabsTitle = getAllElements('.tab__title', newItem);
    const tabs = getAllElements('.tab', newItem);
    initTabs(tabsTitle, tabs);
    removeButton.addEventListener('click', removeEmployeeHandler);
  };
  addTrigger.removeEventListener('click', addEmployeeHandler);
  addTrigger.addEventListener('click', addEmployeeHandler);
};
initEmployee();
const initElement = (triggerClass, parentClass, referenceClass, deleteCallback, limit = 3) => {
  const triggers = getAllElements(triggerClass);
  const initHandler = e => {
    const parent = getParent(e.target, parentClass);
    const referenceItems = getAllElements(referenceClass, parent);
    const newItem = cloneElement(referenceItems[referenceItems.length - 1]);
    addLast(referenceItems, newItem);
    const removeButton = getElement('.remove', newItem);
    toggleClass(removeButton, defaultClasses.hidden, false);
    newItem.setAttribute(defaultAttributes.dataId, referenceItems.length + 1);
    const fields = getAllElements('input', newItem);
    if (fields) fields.forEach(item => item.value = '');
    if (referenceItems.length + 1 < limit) {
      triggers?.forEach(item => toggleClass(item, defaultClasses.hidden, false));
    } else triggers?.forEach(item => toggleClass(item, defaultClasses.hidden, true));
    niceSelectBind(newItem);
    deleteCallback();
  };
  if (triggers) setManyListener(triggers, initHandler);
};
const initElementDelete = (triggerClass, addTriggerClass, parentClass, referenceClass, limit = 3) => {
  const deleteButtons = document?.querySelectorAll(triggerClass);
  const triggers = document?.querySelectorAll(addTriggerClass);
  if (!deleteButtons) return;
  const initHandler = e => {
    const target = e.target;
    const parent = getParent(target, parentClass);
    const referenceItems = parent.querySelectorAll(referenceClass);
    if (referenceItems.length < limit) triggers?.forEach(item => toggleClass(item, defaultClasses.hidden, false));else triggers?.forEach(item => toggleClass(item, defaultClasses.hidden, true));
    getParent(target, parentClass).remove();
  };
  setManyListener(deleteButtons, initHandler);
};
const initDocsDelete = () => {
  initElementDelete('.document__list .remove', '.add-document', '.document__item', '.document__list .document__item', 10);
};
const initDocs = () => {
  initDocsDelete();
  initElement('.add-document', '.document__wrapper', '.document__list .document__item', initDocsDelete, 10);
};
const initCommunicationDelete = () => {
  initElementDelete('.communication__list .remove', '.add-communication', '.communication__item', '.communication__list .communication__item', 10);
};
const initCommunication = () => {
  initCommunicationDelete();
  initElement('.add-communication', '.communication__wrapper', '.communication__list .communication__item', initCommunicationDelete, 10);
};
initDocs();
initCommunication();
removeElement('.sidebar__notification .card__wrapper', '.card__wrapper .modal__close');
const initRangeButton = (selector, parent = false, limit = 3) => {
  const addRangeButton = getAllElements(selector, parent || undefined);
  if (!addRangeButton) return;
  const initHandler = e => {
    const target = e.target;
    const parent = getParent(target, '.range-list');
    const rangeItems = getAllElements('.range-item', parent);
    const lastItem = rangeItems[rangeItems.length - 1];
    const dataId = rangeItems.length + 1;
    const newRange = cloneElement(lastItem);
    const fields = getAllElements('input', newRange);
    if (fields) fields.forEach(item => item.value = '');
    const separator = getElement('.separator', lastItem);
    const item = getElement('.separator', newRange);
    const removeButton = getElement('.remove', newRange);
    toggleClass(separator, defaultClasses.hidden, false);
    toggleClass(item, defaultClasses.hidden, true);
    toggleClass(removeButton, defaultClasses.hidden, false);
    setAttribute(newRange, 'data-id', dataId);
    addLast(rangeItems, newRange);
    initRangeButtonDelete(false, selector);
    const addRangeButton = getAllElements(selector, parent || undefined);
    addRangeButton.forEach(item => toggleClass(item, defaultClasses.hidden, true));
    console.log(addRangeButton);
    if (dataId === limit) toggleClass(target, defaultClasses.hidden, true);else toggleClass(target, defaultClasses.hidden, false);
  };
  setManyListener(addRangeButton, initHandler);
};
const initRangeButtonDelete = (parent = false, addClass, limit = 3) => {
  const deleteRangeButton = getAllElements('.range-item .remove', parent || undefined);
  if (!deleteRangeButton) return;
  const initHandler = e => {
    const target = e.target;
    const parent = getParent(target, '.range-item');
    const rangeParent = getParent(target, '.range-list');
    const rangeItems = getAllElements('.range-item', rangeParent);
    const addButton = getElement(addClass, rangeParent);
    if (!addButton || !rangeItems || !rangeParent || !parent) return;
    const lastIndex = rangeItems.length - 1;
    const lastElement = rangeItems[rangeItems.length - 1];
    const lastSeparator = getElement('.separator', lastElement);
    toggleClass(lastSeparator, defaultClasses.hidden, true);
    if (lastIndex === limit) toggleClass(addButton, defaultClasses.hidden, true);else toggleClass(addButton, defaultClasses.hidden, false);
    parent.remove();
  };
  setManyListener(deleteRangeButton, initHandler);
};
const initRanges = () => {
  initRangeButton('.add-picket');
  initRangeButton('.add-gallery');
  initRangeButton('.range-pk-exit-add');
  initRangeButton('.range-pk-add');
  initRangeButtonDelete(false, '.date-add');
  initRangeButtonDelete(false, '.add-gallery');
  initRangeButtonDelete(false, '.range-pk-exit-add');
  initRangeButtonDelete(false, '.range-pk-add');
};
initRangeButton('.date-add');
initRanges();
const initWikiBar = () => {
  const wikiBody = getElement('.wiki-content');
  if (!wikiBody) return;
  const wikiH2 = getAllElements('h2', wikiBody);
  const wikiH3 = getAllElements('h3', wikiBody);
  const wikiH4 = getAllElements('h4', wikiBody);
  const wikiH5 = getAllElements('h5', wikiBody);
  const setClass = (items, className) => {
    items.forEach(item => {
      toggleClass(item, `unique-header-${className}`, true);
      setId(item, translit(item.innerHTML));
    });
  };
  setClass(wikiH2, 2);
  setClass(wikiH3, 3);
  setClass(wikiH4, 4);
  setClass(wikiH5, 5);
  const wikiHeaders = getAllElements('[class^=unique-header]', wikiBody);
  const addNavItems = () => {
    const navbarItems = getAllElements('.wiki-bar__item');
    const navbarReference = getElement('.wiki-bar__item-reference');
    wikiHeaders.forEach(header => {
      const newNavbarItem = cloneElement(navbarReference);
      navbarItems[0].before(newNavbarItem);
      toggleClass(newNavbarItem, 'wiki-bar__item-reference', false);
      toggleClass(newNavbarItem, defaultClasses.hidden, false);
      setText(newNavbarItem, header.innerHTML);
      setAttribute(newNavbarItem, 'href', `#${header.id}`);
    });
  };
  addNavItems();
};
initWikiBar();
const initAccordions = () => {
  const accordions = document.querySelectorAll('.accordion');
  const accordionButtons = document.querySelectorAll('.accordion__open');
  const accordionButtonHandler = e => {
    accordions.forEach(accordion => {
      const parent = e.target.closest('.accordion__open');
      if (accordion.getAttribute('data-acc') === parent.getAttribute('data-acc')) {
        const parent = accordion.parentElement;
        const panel = accordion.nextElementSibling;
        const accordionOpen = accordion.querySelector('.accordion__open');
        const panels = parent.children;
        if (accordion.getAttribute('data-acc-some')) {
          for (const panel of panels) {
            panelOpen(panel, accordionOpen);
          }
        } else {
          panelOpen(panel, accordionOpen);
        }
      }
    });
  };
  accordionButtons.forEach(button => {
    button.removeEventListener('click', accordionButtonHandler);
    button.addEventListener('click', accordionButtonHandler);
  });
};
function panelOpen(panel, accordionOpen) {
  if (panel.className.includes(defaultClasses.active)) {
    accordionOpen.classList.remove(defaultClasses.active);
    panel.classList.remove(defaultClasses.active);
  } else {
    accordionOpen.classList.add(defaultClasses.active);
    panel.classList.add(defaultClasses.active);
  }
}
initAccordions();
let alert_icons = document.querySelectorAll('.alert__view');
let alerts = document.querySelectorAll('.alert__info');
alert_icons.forEach((message, index) => {
  message.addEventListener('mouseenter', e => {
    console.log(alerts[index]);
    alerts[index].classList.add('alert_show');
  });
  message.addEventListener('mouseleave', e => {
    alerts[index].classList.remove('alert_show');
  });
});
let alertCloseButtons = document.querySelectorAll('.alert .alert__close');
alertCloseButtons.forEach(button => {
  const parent = button.closest('.alert');
  button.addEventListener('click', e => parent.remove());
});
const dropdownClass = 'dropdown';
const dropdownActiveClass = 'dropdown_active';
const dropdownItemClass = 'dropdown__item';
const dropdownCurrentItemClass = 'dropdown__current';
const toggleDropdown = () => {
  const dropdowns = document.querySelectorAll(`.${dropdownClass}`);
  if (!dropdowns) return;
  const toggleDropdownHandler = dropdown => {
    if (dropdown.classList.contains(dropdownActiveClass)) dropdown.classList.remove(dropdownActiveClass);else dropdown.classList.add(dropdownActiveClass);
  };
  dropdowns.forEach(dropdown => {
    const current = dropdown.querySelector(`.${dropdownCurrentItemClass}`);
    toggleDropdownHandler(dropdown);
    current.removeEventListener('click', () => toggleDropdownHandler(dropdown));
    current.addEventListener('click', () => toggleDropdownHandler(dropdown));
  });
};
const setDropdownDisabled = (dropdown, isDisabled = false) => dropdown.disabled = isDisabled;
const setDropdownHidden = (dropdown, isHidden = false) => {
  if (isHidden) dropdown.classList.add('hidden');else dropdown.classList.remove('hidden');
};
const selectDropdownItem = (targetClass, callback = () => false) => {
  const dropdownItems = document.querySelectorAll(`.${targetClass}`);
  if (!dropdownItems) return;
  const selectDropdownItemHandler = e => {
    const parent = e.target.closest(`.${dropdownClass}`);
    parent.classList.remove(dropdownActiveClass);
    callback(e);
  };
  dropdownItems.forEach(item => {
    item.removeEventListener('click', selectDropdownItemHandler);
    item.addEventListener('click', selectDropdownItemHandler);
  });
};
const closeDropdown = e => {
  const dropdown = document.querySelector(`.${dropdownActiveClass}`);
  if (!dropdown) return;
  const withinBoundaries = e.composedPath().includes(dropdown);
  if (!withinBoundaries) dropdown.classList.remove(dropdownActiveClass);
};
document.addEventListener('click', closeDropdown);
document.addEventListener('click', closeDropdown);
toggleDropdown();
const initUploadFiles = () => {
  const inputs = getAllElements('.input_file');
  inputs.forEach(input => {
    const label = getElement('label', input.parentElement);
    const labelValue = label.innerHTML;
    input.addEventListener('change', function (e) {
      const clearButton = getElement('.clear', e.target.parentElement);
      let fileName = '';
      if (this.files && this.files.length > 1) {
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
      } else fileName = e.target.value.split('\\').pop();
      if (fileName) {
        label.querySelector('span').innerHTML = fileName;
        toggleClass(clearButton, defaultClasses.hidden, false);
      } else {
        toggleClass(clearButton, defaultClasses.hidden, true);
        label.innerHTML = labelValue;
      }
      const clearButtonHandler = e => {
        e.preventDefault();
        input.value = '';
        input.dispatchEvent(new Event('change'));
      };
      clearButton.removeEventListener('click', clearButtonHandler);
      clearButton.addEventListener('click', clearButtonHandler);
    });
    input.addEventListener('focus', () => toggleClass(input, 'has-focus', true));
    input.addEventListener('blur', () => toggleClass(input, 'has-focus', false));
  });
};
const initSecretInputs = () => {
  const secretToggleButtons = getAllElements('.password');
  const secretToggleHandler = e => {
    const target = e.target;
    const parent = target.parentNode;
    const input = getElement('input', parent);
    if (input.getAttribute('type') === 'password') {
      toggleClass(target, 'view', true);
      setAttribute(input, 'type', 'text');
    } else {
      toggleClass(target, 'view', false);
      setAttribute(input, 'type', 'password');
    }
  };
  setManyListener(secretToggleButtons, secretToggleHandler);
};
initSecretInputs();
initUploadFiles();
const initMenu = () => {
  let isOpen = false;
  const menu = getElement('.action_menu');
  const menuHandler = e => {
    if (getMatchesParent(e.target, '.action_menu__open', '.action_menu__open') && !isOpen) {
      toggleClass(menu, 'action_menu__active', true);
      isOpen = !isOpen;
    } else {
      toggleClass(menu, 'action_menu__active', false);
      isOpen = !isOpen;
    }
  };
  document.removeEventListener('click', menuHandler);
  document.addEventListener('click', menuHandler);
};
initMenu();
const toggleModal = () => {
  const triggers = getAllElements('.modal-trigger');
  const modals = getAllElements('.modal-body');
  const activeClass = 'modal__active';
  const toggleModalHandler = triggerName => {
    modals.forEach(modal => {
      const modalName = modal.getAttribute('data-modal');
      if (triggerName === modalName) toggleClass(modal, activeClass, true);else toggleClass(modal, activeClass, false);
    });
  };
  triggers.forEach(trigger => {
    const triggerName = trigger.getAttribute('data-modal-trigger');
    trigger.removeEventListener('click', () => toggleModalHandler(triggerName));
    trigger.addEventListener('click', () => toggleModalHandler(triggerName));
  });
};
const closeModalHandler = e => {
  const parentModalClass = '.modal__wrapper';
  const closeModalClass = '.close';
  const activeClass = 'modal__active';
  if (e.target.matches(`.${activeClass}`) || e.target.matches(closeModalClass)) {
    const parent = e.target.closest(parentModalClass);
    toggleClass(parent, activeClass, false);
  }
};
const closeModal = modal => {
  const activeClass = 'modal__active';
  toggleClass(modal, activeClass, false);
};
const showModal = modal => {
  const activeClass = 'modal__active';
  toggleClass(modal, activeClass, true);
};
document.removeEventListener('click', closeModalHandler);
document.addEventListener('click', closeModalHandler);
toggleModal();
const niceSelectBind = parent => {
  const allSelectInput = getAllElements('select', parent || undefined);
  const allNiceSelectInput = getAllElements('.nice-select', parent || undefined);
  if (!allSelectInput || !allNiceSelectInput) return;
  allNiceSelectInput?.forEach(item => item.remove());
  allSelectInput.forEach(item => NiceSelect.bind(item, {
    placeholder: 'Выбрать..'
  }));
};
niceSelectBind();
const initTabs = (tabsTitleList, tabsList) => {
  const tabsTitle = tabsTitleList || getAllElements('.tab__title');
  const tabs = tabsList || getAllElements('.tab');
  const activeTabClass = 'tab_active';
  if (!tabsTitle || !tabs) return;
  const toggleTabsHandler = e => {
    const target = e.target;
    tabs.forEach(tab => {
      if (tab.getAttribute('data-tab-title') === target.getAttribute('data-tab-title')) {
        tabs.forEach(item => toggleClass(item, activeTabClass, false));
        tabsTitle.forEach(item => toggleClass(item, activeTabClass, false));
        toggleClass(target, activeTabClass, true);
        toggleClass(tab, activeTabClass, true);
        if (target.getAttribute('data-with-url') === 'true') window.location.hash = tab.getAttribute('data-tab-title');
      }
    });
  };
  setManyListener(tabsTitle, toggleTabsHandler);
  const url = window.location?.hash.replace('#', '');
  if (!url) return;
  tabs.forEach(tab => {
    if (tab.getAttribute('data-tab-title') !== url) return;
    tabsTitle.forEach(item => {
      if (item.getAttribute('data-tab-title') !== url) item.classList.remove(activeTabClass);else item.classList.add(activeTabClass);
    });
    tabs.forEach(item => {
      if (item.getAttribute('data-tab-title') !== url) item.classList.remove(activeTabClass);else item.classList.add(activeTabClass);
    });
  });
};
initTabs();
const addInputData = (parentClass, inputClass, data) => {
  const dataInfo = getElement(parentClass);
  if (!dataInfo) return;
  const dataIdElement = getElement(inputClass, dataInfo);
  const dataIdList = dataIdElement.value.split(',');
  const isIsset = dataIdList.map(item => item === data);
  if (isIsset.indexOf(true) !== -1) return;
  dataIdList.push(data);
  dataIdElement.value = dataIdList.length > 0 ? dataIdList.filter(Boolean).join(',') : '';
};
const removeInputData = (parentClass, inputClass, data, isClear = false) => {
  const dataInfo = getElement(parentClass);
  if (!dataInfo) return;
  const dataIdElement = getElement(inputClass, dataInfo);
  const dataIdList = dataIdElement.value.split(',');
  let newDataIdList = dataIdList.map(item => item !== data ? item : false);
  newDataIdList = newDataIdList.filter(Boolean);
  dataIdElement.value = newDataIdList.length > 0 ? newDataIdList.filter(Boolean).join(',') : '';
  dataIdElement.value = isClear ? '' : dataIdElement.value;
};
const getInputData = (parentClass, inputClass) => {
  const dataInfo = getElement(parentClass);
  if (!dataInfo) return;
  const dataIdElement = getElement(inputClass, dataInfo);
  return dataIdElement.value.split(',').filter(Boolean);
};
const addCollectorInputData = data => addInputData('#collector-search-data', '.selected-collectors', data);
const removeCollectorInputData = isClear => removeInputData('#collector-search-data', '.selected-collectors', isClear);
const getCollectorInputData = () => getInputData('#collector-search-data', '.selected-collectors');
const addEmployeeInputData = data => addInputData('#selected-employee', '.selected-employee__input', data);
const removeEmployeeInputData = isClear => removeInputData('#selected-employee', '.selected-employee__input', isClear);
const getEmployeeInputData = () => getInputData('#selected-employee', '.selected-employee__input');
const addDropdownData = data => addInputData('.dropdown__info', 'input.selected-id', data);
const removeDropdownData = isClear => removeInputData('.dropdown__info', 'input.selected-id', isClear);
const getDropdownData = () => getInputData('.dropdown__info', 'input.selected-id');
const actionModal = e => {
  const target = e.target;
  const modal = getElement('#action-modal');
  if (!modal) return;
  const modalText = getElement('.action-modal-text', modal);
  const listText = getAllElements('.action-modal-list-reference', modal);
  const buttonText = getElement('.action-button-text', modal);
  const targetModalText = target.getAttribute('data-modal-text');
  const targetButtonText = target.getAttribute('data-button-text');
  const targetButtonAction = target.getAttribute('data-value');
  const activeClass = 'modal__active';
  const selectedData = getDropdownData();
  const tableData = getTableData();
  setText(modalText, targetModalText);
  setText(buttonText, targetButtonText);
  setAttribute(buttonText, 'data-action', targetButtonAction);
  selectedData.forEach(item => {
    listText.forEach((item, index) => index > 0 ? item.remove() : false);
    tableData.forEach(data => {
      if (item !== data.id) return;
      const newRow = listText[0].cloneNode(true);
      listText[0].after(newRow);
      setText(newRow, data.value);
      toggleClass(newRow, defaultClasses.hidden, false);
    });
  });
  toggleClass(modal, activeClass, true);
};
selectDropdownItem(dropdownItemClass, actionModal);
const getTableData = () => {
  const tableRows = getAllElements('.table__wrapper .table__row');
  const data = [];
  tableRows.forEach(row => {
    const rowId = row.getAttribute('data-id');
    const rowValue = row.getAttribute('data-value');
    if (rowId && rowValue) data.push({
      id: rowId,
      value: rowValue
    });
  });
  return data;
};
const initTableSelectRow = () => {
  const tableSelectAllCheckbox = getElement('thead input[type="checkbox"]');
  const tableCheckbox = getAllElements('.table__row td:first-child input[type="checkbox"]');
  const activeClass = 'tr_active';
  const rowClass = '.table__row';
  if (!tableSelectAllCheckbox || !tableCheckbox) return;
  const checkSelected = () => {
    const actionDropdown = getElement('#action-dropdown');
    let temp = [];
    tableCheckbox.forEach(checkbox => temp.push(checkbox.checked));
    if (temp.indexOf(true) === -1) {
      setDropdownHidden(actionDropdown, true);
      setDropdownDisabled(actionDropdown, true);
      tableSelectAllCheckbox.checked = false;
    } else {
      setDropdownHidden(actionDropdown, false);
      setDropdownDisabled(actionDropdown, false);
      tableSelectAllCheckbox.checked = true;
    }
  };
  const toggleRows = checkbox => {
    const parent = checkbox.closest(rowClass);
    if (checkbox.checked) {
      toggleClass(parent, activeClass, true);
      addDropdownData(parent.getAttribute('data-id') || '');
    } else {
      toggleClass(parent, activeClass, false);
      removeDropdownData(parent.getAttribute('data-id') || '');
    }
    checkSelected();
  };
  const toggleAllHandler = e => {
    tableCheckbox.forEach(checkbox => {
      checkbox.checked = e.target.checked;
      toggleRows(checkbox);
    });
    checkSelected();
  };
  const selectRowHandler = e => {
    const checkbox = e.target;
    toggleRows(checkbox);
    let temp = [];
    tableCheckbox.forEach(checkbox => temp.push(checkbox.checked));
    tableSelectAllCheckbox.checked = temp.indexOf(true) !== -1;
  };
  tableCheckbox.forEach(checkbox => {
    toggleRows(checkbox);
    checkbox.removeEventListener('click', selectRowHandler);
    checkbox.addEventListener('click', selectRowHandler);
  });
  checkSelected();
  tableSelectAllCheckbox.removeEventListener('click', toggleAllHandler);
  tableSelectAllCheckbox.addEventListener('click', toggleAllHandler);
};
initTableSelectRow();
/**
 Функция для поиска информации о коллекторах в DOM-дереве
 @param {Object} options - объект с параметрами поиска
 @param {string} options.needleClass - CSS-селектор для поиска элементов, содержащих информацию о коллекторах
 @param {string} options.layerClass - CSS-селектор для поиска родительских элементов
 @param {HTMLElement} [options.parent=false] - родительский элемент, внутри которого будет производиться поиск
 @param {Array} [options.children=[]] - массив объектов с параметрами поиска дочерних элементов
 @param {string} options.children.needleClass - CSS-селектор для поиска элементов, содержащих информацию о дочерних коллекторах
 @param {string} options.children.layerClass - CSS-селектор для поиска родительских элементов дочерних коллекторов
 @param {Array} [options.children.children=[]] - массив объектов с параметрами поиска дочерних элементов дочерних коллекторов
 @returns {Array} - массив объектов с информацией о коллекторах, найденных в DOM-дереве
 */
const searchCollectorName = ({
  needleClass,
  layerClass,
  parent = false,
  children = []
}) => {
  const elements = getAllElements(layerClass, parent);
  const collectors = Array.from(elements).map(element => {
    const needleElements = getAllElements(needleClass, element);
    const needleInfos = Array.from(needleElements).map(needleElement => {
      const name = needleElement.getAttribute('data-name');
      const fullName = needleElement.getAttribute('data-fullname');
      const id = needleElement.getAttribute('data-id');
      const info = {
        id,
        name,
        fullName
      };
      if (children.length > 0) {
        const childProps = {
          needleClass: children[0].needleClass,
          layerClass: children[0].layerClass,
          children: children[0].children || [],
          parent: element
        };
        info.children = searchCollectorName(childProps);
      }
      return info;
    });
    return needleInfos.length === 1 ? needleInfos[0] : needleInfos;
  });
  return collectors.flat();
};

/**
 Функция searchInNestedObjects осуществляет поиск объектов в массиве
 и его вложенных объектах по подстроке в свойстве name.
 @param {Array} array - массив объектов, в которых нужно осуществить поиск
 @param {string} trigger - подстрока, по которой осуществляется поиск
 @param {string} parent - идентификатор родительского объекта
 @returns {Array} - массив объектов, удовлетворяющих условию поиска
 */
const searchInNestedObjects = (array, trigger, parent) => {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    const {
      id,
      name,
      fullName,
      children
    } = array[i];
    const currentObject = {
      id,
      name,
      parent,
      fullName
    };
    if (transformString(name).includes(transformString(trigger))) result.push(currentObject);
    if (Array.isArray(children)) result = result.concat(searchInNestedObjects(children, trigger, id));else if (children && transformString(children.name).includes(transformString(trigger))) {
      const object = {
        id: children.id,
        name: children.name,
        parent: id,
        fullName: children.fullName
      };
      result.push(object);
    } else if (children && Array.isArray(children.children)) {
      result = result.concat(searchInNestedObjects(children.children, trigger, children.id));
    }
  }
  return result;
};

/**
 Функция searchByIdInNestedObjects осуществляет поиск объектов в массиве
 и его вложенных объектах по их идентификатору.
 @param {Array} array - массив объектов, в которых нужно осуществить поиск
 @param {string} id - идентификатор объекта, который необходимо найти
 @param {string} parentId - идентификатор родительского объекта (по умолчанию - null)
 @returns {Array} - массив объектов, удовлетворяющих условию поиска
 */
const searchByIdInNestedObjects = (array, id, parentId = null) => {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    const {
      id: objectId,
      name,
      children,
      fullName
    } = array[i];
    const currentObject = {
      id: objectId,
      name,
      parentId,
      children,
      fullName
    };
    if (objectId === id) result.push(currentObject);
    if (Array.isArray(children)) result = result.concat(searchByIdInNestedObjects(children, id, objectId));else if (children && children.id === id) {
      const object = {
        id: children.id,
        name: children.name,
        parentId: objectId,
        children,
        fullName: children.fullName
      };
      result.push(object);
    } else if (children && Array.isArray(children.children)) result = result.concat(searchByIdInNestedObjects(children.children, id, children.id));
  }
  return result;
};

// Получение всех коллекторов
const initAllCollectorNames = () => {
  const props = {
    needleClass: '.rek-name',
    // CSS-класс элемента, содержащего имя РЭК'а
    layerClass: '.parent-layer',
    // CSS-класс родительского элемента, в котором ищутся искомые элементы
    children: [{
      needleClass: '.children-name',
      // CSS-класс элемента, содержащего имя ребенка
      layerClass: '.children-layer',
      // CSS-класс родительского элемента, в котором ищутся элементы-дети
      children: [{
        needleClass: '.sub-children-name',
        layerClass: '.sub-children-layer'
      }] // массив объектов с дочерними элементами
    }]
  };

  return searchCollectorName(props);
};
const collectorsList = initAllCollectorNames();
// Классы
const parentClass = '.collector__list';
const itemClass = '.collector__item';
const removeClass = '.collector__remove';

// Коллекторы

const initRemove = parentElement => {
  const parent = getElement(parentClass, parentElement || undefined);
  const items = getAllElements(itemClass, parent);
  const removeHandler = e => {
    const target = e.target;
    const parent = getParent(target, itemClass);
    const dataId = parent.getAttribute(defaultAttributes.dataId);
    removeCollectorInputData(dataId);
    parent.remove();
  };
  items?.forEach(item => {
    const removeButton = getElement(removeClass, item);
    if (!removeButton) return;
    removeButton.removeEventListener('click', removeHandler);
    removeButton.addEventListener('click', removeHandler);
  });
};
const initCollector = element => {
  niceSelectBind(element);
  initRanges();
  initRemove();
};
const addCollectorHandler = () => {
  const referenceCollector = getElement('.collector__item-reference');
  const collectorItems = getAllElements('.collector__item');
  const selectedCollectors = getCollectorInputData();
  const collectorList = initAllCollectorNames();
  let issetCollectors = [];
  collectorItems.forEach(item => issetCollectors.push(item.getAttribute(defaultAttributes.dataId) || ''));
  let result = selectedCollectors;
  if (issetCollectors.filter(Boolean).length > 0) {
    result = deleteDuplicateInArray(selectedCollectors, issetCollectors);
    const deletedItems = deleteDuplicateInArray(issetCollectors, selectedCollectors);
    deletedItems.forEach(item => {
      if (item) getElement(`#collector-item-${item}`).remove();
    });
  }
  result.forEach(collector => {
    const newCollectorItem = cloneElement(referenceCollector);
    const collectorFullName = getElement('.collector__fullname', newCollectorItem);
    const collectorInfo = searchByIdInNestedObjects(collectorList, collector)[0];
    addLast(collectorItems, newCollectorItem);
    toggleClass(newCollectorItem, defaultClasses.hidden, false);
    toggleClass(newCollectorItem, 'collector__item-reference', false);
    setText(collectorFullName, collectorInfo.fullName);
    setId(newCollectorItem, `collector-item-${collectorInfo.id}`);
    setAttribute(newCollectorItem, defaultAttributes.dataId, collectorInfo.id);
    initCollector(newCollectorItem);
  });
};
const initCreateCollector = () => {
  const trigger = getElement('.button_confirm');
  if (!trigger) return;
  trigger.addEventListener('click', () => addCollectorHandler());
};
initCreateCollector();
/**
 Функция toggleSearchElements переключает отображение элементов,
 связанных с результатами поиска.
 @param {NodeListOf<Element>} array - массив элементов, которые нужно переключить
 @param {string} isShow - флаг, указывающий на необходимость показа элементов.
 По умолчанию равен false.
 */
const toggleSearchElements = (array, isShow = 'hide') => {
  // Итерация по массиву элементов
  array.forEach(collector => {
    const parentLayer = getParent(collector, '.parent-layer');
    const childrenLayer = getParent(collector, '.children-layer');
    const subChildrenLayer = getParent(collector, '.sub-children-layer');
    const parentAccordion = getElement('.collector__group', parentLayer);
    const childrenAccordion = getElement('.collector__sub-group', childrenLayer);
    const hide = (isHidden = true) => {
      toggleClass(collector, defaultClasses.find, false);
      toggleClass(collector, defaultClasses.hidden, isHidden);
      toggleClass(parentLayer, defaultClasses.hidden, isHidden);
      toggleClass(parentLayer, defaultClasses.active, false);
      toggleClass(childrenLayer, defaultClasses.hidden, isHidden);
      toggleClass(childrenLayer, defaultClasses.active, false);
      toggleClass(subChildrenLayer, defaultClasses.hidden, isHidden);
      toggleClass(subChildrenLayer, defaultClasses.active, false);
    };
    const show = () => {
      toggleClass(collector, defaultClasses.find, false);
      toggleClass(collector, defaultClasses.hidden, false);
      toggleClass(parentLayer, defaultClasses.hidden, false);
      toggleClass(parentLayer, defaultClasses.active, true);
      toggleClass(childrenLayer, defaultClasses.hidden, false);
      toggleClass(childrenLayer, defaultClasses.active, true);
      toggleClass(subChildrenLayer, defaultClasses.hidden, false);
      toggleClass(subChildrenLayer, defaultClasses.active, true);
    };
    switch (isShow) {
      case 'default':
        hide(false);
        toggleClass(childrenAccordion, defaultClasses.active, false);
        toggleClass(parentAccordion, defaultClasses.active, false);
        break;
      case 'show':
        show();
        toggleClass(childrenAccordion, defaultClasses.active, true);
        toggleClass(parentAccordion, defaultClasses.active, true);
        break;
      default:
        hide(true);
        toggleClass(childrenAccordion, defaultClasses.active, false);
        toggleClass(parentAccordion, defaultClasses.active, false);
        break;
    }
  });
};

/**
 Функция searchCollectors выполняет поиск элементов-коллекторов
 и скрывает/отображает элементы в зависимости от результата поиска.
 @param {Event} e - объект события, содержащий информацию о событии
 */
const searchCollectors = e => {
  const inputValue = transformString(e.target.value);
  const collectorNames = getAllElements('.collector__name');
  if (!inputValue || inputValue.length < 3) return toggleSearchElements(collectorNames, 'default');else toggleSearchElements(collectorNames, 'hide');
  const result = searchInNestedObjects(collectorsList, inputValue, null);
  result.forEach(item => {
    const findElement = getAllElements(`#item-${item.id}`);
    toggleSearchElements(findElement, 'show');
    toggleClass(findElement[0], defaultClasses.find, true);
  });
};
const initCollectorSearch = () => {
  const collectorInput = getElement('#collector-search');
  if (!collectorInput) return;
  collectorInput.oninput = searchCollectors;
};
initCollectorSearch();
const initCollectorSelect = () => {
  const collectorNames = getAllElements('.collector__name');
  const selectAllButtons = getAllElements('.select-all');

  // Получение списка всех коллекторов
  const collectorList = initAllCollectorNames();
  if (!collectorNames || !selectAllButtons) return;

  /**
   Переключает состояние выбранного коллектора.
   @function
   @param {HTMLElement} collector - Элемент, на котором произошло событие
   @param {string} dataId - Идентификатор выбранного элемента
   @param {boolean} isOpen - Флаг, указывающий, был ли элемент открыт
   @returns {void}
   */
  const toggleCollector = (collector, dataId, isOpen = false) => {
    const checkIcon = getElement('.icon-dropDown__check', collector);
    if (isOpen) {
      toggleClass(collector, defaultClasses.active, true);
      toggleClass(checkIcon, defaultClasses.hidden, false);
      addCollectorInputData(dataId || '');
    } else {
      if (hasClass(collector, defaultClasses.active)) {
        toggleClass(collector, defaultClasses.active, false);
        toggleClass(checkIcon, defaultClasses.hidden, true);
        removeCollectorInputData(dataId || '');
      } else {
        toggleClass(collector, defaultClasses.active, true);
        toggleClass(checkIcon, defaultClasses.hidden, false);
        addCollectorInputData(dataId || '');
      }
    }
  };

  /**
   Переключает состояние выбранного родительского коллектора.
   @function
   @param {HTMLElement} collector - Элемент, на котором произошло событие
   @param {string} dataId - Идентификатор выбранного элемента
   @returns {void}
   */
  const toggleParentCollector = (collector, dataId) => {
    const parentElement = getParent(collector, `.${defaultClasses.collector.parentLayer}`);
    const groupElement = getParent(collector, `.${defaultClasses.collector.childrenLayer}`);
    const parentSelectText = getElement('.select-all__label p', parentElement);
    const groupSelectText = getElement('.select-all__label p', groupElement);
    const item = searchByIdInNestedObjects(collectorList, dataId)[0];
    const parent = searchByIdInNestedObjects(collectorList, item.parentId)[0];
    const selected = getCollectorInputData();
    const parentChildrenIdList = parent.children.map(child => child.id);
    const selectedParentChildren = selected.filter(select => parentChildrenIdList.includes(select));
    const isFullSelected = selectedParentChildren.length === parentChildrenIdList.length;
    const isSelected = selectedParentChildren.length > 0;
    toggleClass(groupElement, 'full-selected', isFullSelected);
    toggleClass(parentElement, defaultClasses.find, isSelected);
    toggleClass(groupElement, defaultClasses.find, isSelected);
    const unSelectText = 'Снять выделение';
    const selectText = 'Выбрать всё';
    if (isSelected) {
      setText(groupSelectText, unSelectText);
      setText(parentSelectText, unSelectText);
    } else {
      setText(groupSelectText, selectText);
      setText(parentSelectText, selectText);
    }
  };

  /**
   Обработчик клика на элемент выбора коллектора.
   @param {Event} e - событие клика на элемент выбора коллектора
   */
  const selectCollectorHandler = e => {
    const collector = getMatchesParent(e.target, '.collector__name');
    const dataId = getElement('.collector-value', collector).getAttribute(defaultAttributes.dataId);
    toggleCollector(collector, dataId);
    toggleParentCollector(collector, dataId);
  };

  /**
   Обработчик клика на кнопку выбора всех коллекторов.
   @param {Event} e - событие клика на кнопку выбора всех коллекторов
   */
  const selectAllHandler = e => {
    const target = e.target;
    const parent = getParent(target, '.children-layer') || getParent(target, '.parent-layer');
    if (!parent) return;
    const parentId = replaceText(parent.id, 'item-', '');
    const children = searchByIdInNestedObjects(collectorList, parentId)[0].children;
    collectorNames.forEach(collector => {
      const dataId = getElement('.collector-value', collector).getAttribute(defaultAttributes.dataId);
      children.forEach(child => {
        if (child.children) {
          child?.children?.forEach(subChild => {
            if (dataId !== subChild.id) return;
            toggleCollector(collector, dataId, target.checked);
            toggleParentCollector(collector, dataId);
          });
        } else {
          if (dataId !== child.id) return;
          toggleCollector(collector, dataId, target.checked);
          toggleParentCollector(collector, dataId);
        }
      });
    });
  };
  setManyListener(collectorNames, selectCollectorHandler);
  setManyListener(selectAllButtons, selectAllHandler);
  const selectDefault = () => {
    const allActiveCollectors = getAllElements('.collector__name.active');
    const defaultSelectedValue = getCollectorInputData();
    if (defaultSelectedValue.length > 0) {
      allActiveCollectors.forEach(collector => {
        if (!collector) return;
        const dataId = getElement('.collector-value', collector).getAttribute(defaultAttributes.dataId);
        const checkIcon = getElement('.icon-dropDown__check', collector);
        if (hasClass(collector, defaultClasses.active)) {
          toggleClass(collector, defaultClasses.active, false);
          toggleClass(checkIcon, defaultClasses.hidden, true);
        }
        toggleParentCollector(collector, dataId);
      });
      defaultSelectedValue.forEach(item => {
        const collector = getElement(`#item-${item}`);
        if (!collector) return;
        toggleCollector(collector, item);
        toggleParentCollector(collector, item);
      });
    }
  };
  const selectedCollectorsForm = getElement('#collector-search-data');
  if (!selectedCollectorsForm) return;
  const observer = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes') selectDefault();
    }
  });
  observer.observe(selectedCollectorsForm, {
    attributes: true,
    childList: true,
    subtree: true
  });
  window.addEventListener('load', () => selectDefault());
};
initCollectorSelect();
const getEmployeeList = () => {
  const employeeList = getAllElements('.employee');
  let response = [];
  employeeList.forEach(employee => {
    const dataId = employee.getAttribute(defaultAttributes.dataId);
    const dataValue = employee.getAttribute(defaultAttributes.dataValue);
    const name = getElement('.name', employee).innerHTML;
    const birthday = getElement('.birthday', employee).innerHTML;
    const citizenship = getElement('.citizenship', employee).innerHTML;
    const docs = getElement('.docs', employee).innerHTML;
    const address = getElement('.address', employee).innerHTML;
    const post = getElement('.post', employee).innerHTML;
    response.push({
      id: dataId,
      value: dataValue,
      name,
      birthday,
      citizenship,
      docs,
      address,
      post
    });
  });
  return response;
};
const getEmployeeById = id => {
  const list = getEmployeeList();
  return list.find(item => item.id === id);
};
const getEmployeeByName = name => {
  const list = getEmployeeList();
  let response = [];
  list.forEach(item => transformString(item.name).indexOf(transformString(name)) !== -1 ? response.push(item) : false);
  return response;
};
const toggleFindEmployeeElements = (list, type) => {
  switch (type) {
    case 'default':
      list.forEach(item => {
        toggleClass(item, defaultClasses.hidden, false);
      });
      break;
    case 'find':
      list.forEach(item => {
        console.log(item);
        toggleClass(item, defaultClasses.hidden, false);
        console.log(item);
      });
      break;
    case 'hide':
      list.forEach(item => {
        toggleClass(item, defaultClasses.hidden, true);
      });
      break;
  }
};
const searchEmployeeHandler = e => {
  const inputValue = transformString(e.target.value);
  const employeeElementList = getAllElements('.employee');
  if (!inputValue || inputValue.length < 3) return toggleFindEmployeeElements(employeeElementList, 'default');else toggleFindEmployeeElements(employeeElementList, 'hide');
  const result = getEmployeeByName(inputValue);
  result.forEach(item => {
    const findElement = getAllElements(`#employee-item-${item.id}`);
    toggleFindEmployeeElements(findElement, 'find');
    toggleClass(findElement[0], defaultClasses.find, true);
  });
};
const initEmployeeSearch = () => {
  const search = getElement('#employee-search');
  if (!search) return;
  search.oninput = searchEmployeeHandler;
};
initEmployeeSearch();
const toggleEmployee = (employee, isShow = false) => {
  const icon = getElement('.icon', employee);
  if (isShow) {
    toggleClass(employee, defaultClasses.active, true);
    toggleClass(icon, defaultClasses.hidden, false);
    addEmployeeInputData(employee.getAttribute(defaultAttributes.dataId));
  } else {
    if (hasClass(employee, defaultClasses.active)) {
      toggleClass(employee, defaultClasses.active, false);
      toggleClass(icon, defaultClasses.hidden, true);
      removeEmployeeInputData(employee.getAttribute(defaultAttributes.dataId));
    } else {
      toggleClass(employee, defaultClasses.active, true);
      toggleClass(icon, defaultClasses.hidden, false);
      addEmployeeInputData(employee.getAttribute(defaultAttributes.dataId));
    }
  }
};
const initEmployeeSelection = () => {
  const employeeDataList = getEmployeeInputData();
  const employeeList = getAllElements('.employee');
  console.log(employeeDataList);
  if (!employeeDataList || !employeeList) return;
  if (employeeDataList.length > 0) {
    employeeDataList.forEach(item => {
      if (!item) return;
      console.log(item);
      const employee = getElement(`#employee-item-${item}`);
      toggleEmployee(employee, true);
    });
  } else {
    employeeList.forEach(item => {
      const icon = getElement('.icon', item);
      toggleClass(item, defaultClasses.active, false);
      toggleClass(icon, defaultClasses.hidden, true);
    });
  }
};
const initToggleEmployee = list => {
  const employeeList = list || getAllElements('.employee');
  const toggleEmployeeHandler = e => {
    const target = e.target;
    const parent = getMatchesParent(target, '.employee');
    toggleEmployee(parent);
  };
  setManyListener(employeeList, toggleEmployeeHandler);
  const selectedEmployeeForm = getElement('#selected-employee');
  if (!selectedEmployeeForm) return;
  const observer = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
      console.log(mutation);
      if (mutation.type === 'attributes') initEmployeeSelection();
    }
  });
  observer.observe(selectedEmployeeForm, {
    attributes: true,
    childList: true,
    subtree: true
  });
};
initToggleEmployee();
initEmployeeSelection();
const addEmployeeTableRow = item => {
  const tableRowReference = getElement('.employee-row-reference');
  if (!item) return;
  const itemData = getEmployeeById(item);
  const row = cloneElement(tableRowReference);
  initEmployeeTableRow(row, itemData);
};
const initEmployeeTableRow = (row, itemData) => {
  const tableRows = getAllElements('.employee-row');
  setId(row, `employee-row-${itemData.id}`);
  setAttribute(row, defaultAttributes.dataId, itemData.id);
  setAttribute(row, defaultAttributes.dataValue, itemData.name);
  const nameField = getElement('.employee-row__name', row);
  const birthdayField = getElement('.employee-row__birthday', row);
  const citizenshipField = getElement('.employee-row__citizenship', row);
  const docsField = getElement('.employee-row__docs', row);
  const addressField = getElement('.employee-row__address', row);
  const postField = getElement('.employee-row__post', row);
  setText(nameField, itemData.name);
  setText(birthdayField, itemData.birthday);
  setText(citizenshipField, itemData.citizenship);
  setText(docsField, itemData.docs);
  setText(addressField, itemData.address);
  setText(postField, itemData.post);
  addLast(tableRows, row);
  toggleClass(row, defaultClasses.hidden, false);
  toggleClass(getElement('.table__row_nullable'), defaultClasses.hidden, true);
  initTableSelectRow();
};
const initEmployeeTableData = () => {
  const employeeItems = getEmployeeInputData();
  employeeItems.forEach(item => addEmployeeTableRow(item));
};
initEmployeeTableData();
const changeEmployeeTableRows = () => {
  const employeeItems = getAllElements('.employee-row');
  const employeeItemsData = getEmployeeInputData();
  let currentEmployeeList = [];
  employeeItems.forEach(item => {
    currentEmployeeList.push(item.getAttribute(defaultAttributes.dataId));
  });
  currentEmployeeList = currentEmployeeList.filter(Boolean);
  let result = employeeItemsData;
  if (currentEmployeeList.length > 0) result = deleteDuplicateInArray(employeeItemsData, currentEmployeeList);
  const deletedItems = deleteDuplicateInArray(currentEmployeeList, employeeItemsData);
  result.forEach(item => addEmployeeTableRow(item));
  deletedItems.forEach(item => item ? getElement(`#employee-row-${item}`).remove() : false);
};
const removeEmployee = () => {
  const tableSelected = getTableData();
  const modal = getElement('#action-modal');
  tableSelected.forEach(item => {
    if (!item) return;
    getElement(`#employee-row-${item.id}`).remove();
    const tableRows = getAllElements('.employee-row');
    if (tableRows.length <= 1) toggleClass(getElement('.table__row_nullable'), defaultClasses.hidden, false);else toggleClass(getElement('.table__row_nullable'), defaultClasses.hidden, true);
    removeEmployeeInputData(item.id);
    removeDropdownData(item.id);
  });
  closeModal(modal);
  initTableSelectRow();
};
const button = getElement('.employee-select .confirm-button');
button.addEventListener('click', () => changeEmployeeTableRows());
const actionButton = getElement('.action-button-text');
actionButton.addEventListener('click', () => removeEmployee());