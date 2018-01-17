import Browser from './browser';

class UI {
    static initializeUi() {
        let date = Date();
        date = date.slice(0, date.match(/\d{4}/).index + 4);
        document.getElementById('book-title').placeholder = `EpubPress - ${date}`;
    }

    static setErrorMessage(msg) {
        $('#failure-message').text(msg);
    }

    static showSection(section) {
        UI.SECTIONS_SELECTORS.forEach((selector) => {
            if (selector === section) {
                $(selector).show();
            } else {
                $(selector).hide();
            }
        });
    }

    static setAlertMessage(message) {
        $('#alert-message').text(message);
    }

    static updateStatus(progress, message) {
        $('h4#progress-msg').text(message);
        if (progress) {
            return this.animateValueChange($('progress'), progress);
        }
        return Promise.resolve();
    }

    static animateValueChange($el, finalValue) {
        return new Promise((resolve) => {
            const animateFrom = (currentValue) => {
                requestAnimationFrame(() => {
                    if (currentValue === finalValue) {
                        setTimeout(resolve, 100);
                        return;
                    }
                    const diff = currentValue < finalValue ? 1 : -1;
                    const newValue = diff + currentValue;
                    $el.val(newValue);
                    animateFrom(newValue);
                });
            };
            animateFrom($el.val());
        });
    }

    static getCheckbox(props) {
        const html = `<div class="checkbox">
        <label>
        <input class='article-checkbox' type="checkbox" value="${props.url}" name="${props.id}" data-title="${props.title}" data-url="${props.url}">
        <span>${props.title}</span>
        </label>
        </div>`;
        return html;
    }

    static initializeTabList() {

        Browser.getCurrentWindowTabs().then((tabs) => {
            var titleEl = $('#book-title');
            var descEl = $('#book-description');
            tabs.forEach((tab) => {
                var nowEl = $(UI.getCheckbox({
                    title: tab.title,
                    url: tab.url,
                    id: tab.id,
                }));
                nowEl.find('input').change(function (){
                    var my = $(this);
                    if(my.is(':checked')){
                        titleEl.val(my.data('title'));
                        descEl.val(my.data('title') + '-' + my.data('url'));
                    }
                });
                $('#tab-list').append(nowEl);
            });
            chrome.tabs.getSelected(function(tabs)
            {
                titleEl.val(tabs.title);
                descEl.val(tabs.title + '-' + tabs.url);
                $('.article-checkbox[name="' + tabs.id + '"]').attr("checked", true);
            });
        }).catch((error) => {
            UI.setErrorMessage(`Searching tabs failed: ${error}`);
        });
    }
}

UI.SECTIONS_SELECTORS = [
    '#downloadForm',
    '#settingsForm',
    '#downloadSpinner',
    '#downloadSuccess',
    '#downloadFailed',
];

module.exports = UI;
