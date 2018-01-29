(function() {
    this.Modal = function() {
        var defaults = {
            modalId: '',
            height: '200',
            buttonArea: false,
            multiple: true,
            overlayClose: false,
            onClose: null,
            onOpen: null,
            onBeforeOpen: null,
            onAfterClose: null
        };

        if (arguments[0] && typeof arguments[0] === "object") {
            this.opts = extend(defaults, arguments[0]);
        }

        this.init();
    };

    /**
     * @public
     */
    Modal.prototype.init = function () {
        if (this.modalWrapper) {
            return;
        }

        _bind.call(this);
        _bindEvents.call(this);
        _bindAPIs.call(this);

        $('body').append(this.modalWrapper);

        if ($('.custom-modal').length > 1) {
            if (!$(this.modalWrapper).prev().data('multiple')) {
                $(this.modalWrapper).prev().remove();
            }
        }

        if (this.opts.buttonArea) {
            this.addButtonArea();
        }
    };

    Modal.prototype.open = function () {
        var self = this;

        if (typeof self.opts.onBeforeOpen === 'function') {
            self.opts.onBeforeOpen();
        }

        if (this.modalWrapper.style.removeProperty) {
            this.modalWrapper.style.removeProperty('display');
        } else {
            this.modalWrapper.style.removeAttribute('display');
        }

        document.body.classList.add('modal-show');

        this.modalWrapper.classList.add('custom-modal-visible');

        if (typeof self.opts.onOpen === 'function') {
            self.opts.onOpen.call(self);
        }
    };

    Modal.prototype.close = function () {
        if (typeof this.opts.beforeClose === "function") {
            var close = this.opts.beforeClose.call(this);

            if (!close) return;
        }

        var self = this;

        $(self.modalWrapper).remove();

        if ($('.custom-modal').length < 1) {
            document.body.classList.remove('modal-show');
        }

        if (typeof self.opts.onClose === "function") {
            self.opts.onClose.call(this);
        }

        if (typeof self.opts.onAfterClose === "function") {
            this.opts.onAfterClose.call(this);
        }

        _unbindEvents.call(this);
    };

    Modal.prototype.setContent = function (content) {
        if (typeof content === 'string') {
            this.modalContent.innerHTML = content;
        } else {
            this.modalContent.innerHTML = "";
            this.modalContent.appendChild(content);
        }
    };

    Modal.prototype.getContent = function () {
        return this.modalContent;
    };

    Modal.prototype.addButtonArea = function () {
        _bindButtonArea.call(this);
    };

    Modal.prototype.setButtonAreaContent = function (content) {
        this.modalButtonArea.innerHTML = content;
    };

    Modal.prototype.getButtonAreaContent = function () {
        return this.modalButtonArea;
    };

    /**
     * @private
     */
    function _bind() {
        this.modalWrapper = document.createElement('div');
        this.modalWrapper.classList.add('custom-modal');
        this.modalWrapper.id = this.opts.modalId;
        this.modalWrapper.style.display = 'none';

        // 닫기버튼
        this.modalCloseBtn = document.createElement('button');
        this.modalCloseBtn.classList.add('custom-modal-close');

        this.modalCloseBtnIcon = document.createElement('span');
        this.modalCloseBtnIcon.classList.add('custom-modal-closeIcon');
        this.modalCloseBtnIcon.innerHTML = '×';
        this.modalCloseBtn.appendChild(this.modalCloseBtnIcon);

        // 모달
        this.modal = document.createElement('div');
        this.modal.classList.add('custom-modal-box');

        // 모달 닫기 버튼
        this.modal.appendChild(this.modalCloseBtn);

        // 모달 컨텐츠 영역
        this.modalContent = document.createElement('div');
        this.modalContent.classList.add('custom-modal-box-content');
        this.modalContent.style.height = this.opts.height + 'px';
        this.modal.appendChild(this.modalContent);

        this.modalWrapper.appendChild(this.modal);

        $(this.modalWrapper).data('multiple', this.opts.multiple);
    }

    function _bindButtonArea() {
        this.modalButtonArea = document.createElement('div');
        this.modalButtonArea.classList.add('custom-modal-box-footer');
        this.modal.appendChild(this.modalButtonArea);
    }

    function _bindEvents() {
        this._events = {
            clickCloseBtn: this.close.bind(this),
            clickOverlay: _overlayClick.bind(this)
        };
        this.modalCloseBtn.addEventListener('click', this._events.clickCloseBtn);
        this.modalWrapper.addEventListener('mousedown', this._events.clickOverlay);

        $(this.modalWrapper).trigger('beforeShow');
        $(this.modalWrapper).trigger('afterHide');
    }

    function _bindAPIs() {
        var self = this;

        $.fn.modalShowHide = function (param) {
            if(param === 'hide') {
                self.close();
            } else if('show') {
                self.open();
            }
        }
    }

    function _overlayClick(event) {
        if (this.opts.overlayClose && !_findAncestor(event.target, 'custom-modal') &&
            event.clientX < this.modalWrapper.clientWidth) {

            this.close();
        }
    }

    function _findAncestor(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls)) ;

        return el;
    }

    function _unbindEvents() {
        this.modalCloseBtn.removeEventListener('click', this._events.clickCloseBtn);
        this.modalWrapper.removeEventListener('mousedown', this._events.clickOverlay);
    }

    function extend(source, properties) {
        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }
}());