(function(global) {

//图片上传工具
function UploadImage($target, $value){
    var self = this;
    var $body = $('body');
    this.$win = $([
        '<div class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="editorToolImageTitle" aria-hidden="true">',
            '<div class="modal-header">',
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
                '<h3 id="editorToolImageTitle">图片</h3>',
            '</div>',
            '<div class="modal-body">',
                '<div class="upload-img">',
                    '<div class="button">上传图片</div>',
                    '<span class="tip"></span>',
                    '<div class="alert alert-error hide"></div>',
                '</div>',
            '</div>',
        '</div>'
    ].join('')).appendTo($body);

    this.$upload = this.$win.find('.upload-img').css({
        height: 50,
        padding: '60px 0',
        textAlign: 'center',
        border: '4px dashed#ddd'
    });

    this.$uploadBtn = this.$upload.find('.button').css({
        width: 86,
        height: 40,
        margin: '0 auto'
    });

    this.$uploadTip = this.$upload.find('.tip').hide();

    this.file = false;
    var _csrf = $('[name=_csrf]').val();

    this.uploader = WebUploader.create({
        swf: '/public/libs/webuploader/Uploader.swf',
        server: '/upload?_csrf=' + _csrf,
        pick: this.$uploadBtn[0],
        //dnd: this.$upload[0],
        auto: true,
        fileSingleSizeLimit: 2 * 1024 * 1024,
        //sendAsBinary: true,
        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    });

    this.uploader.on('beforeFileQueued', function(file){
        if(self.file !== false){
            return false;
        }
        self.showFile(file);
    });

    this.uploader.on('uploadProgress', function(file, percentage){
        // console.log(percentage);
        self.showProgress(file, percentage * 100);
    });

    this.uploader.on('uploadSuccess', function(file, res){
        if(res.success){
            self.$win.modal('hide');
            console.log(res.url);
            $target.attr('src', res.url);
            $value.val(res.url);
            //self.editor.push('!['+ file.name +']('+ res.url +')');
        }
        else{
            self.removeFile();
            self.showError(res.msg || '服务器走神了，上传失败');
        }
    });

    this.uploader.on('uploadComplete', function(file){
        self.uploader.removeFile(file);
        self.removeFile();
    });

    this.uploader.on('error', function(type){
        self.removeFile();
        switch(type){
            case 'Q_EXCEED_SIZE_LIMIT':
            case 'F_EXCEED_SIZE':
                self.showError('文件太大了, 不能超过2M');
                break;
            case 'Q_TYPE_DENIED':
                self.showError('只能上传图片');
                break;
            default:
                self.showError('发生未知错误');
        }
    });

    this.uploader.on('uploadError', function(){
        self.removeFile();
        self.showError('服务器走神了，上传失败');
    });
};

UploadImage.prototype.removeFile = function(){
    //var self = this;
    this.file = false;
    this.$uploadBtn.show();
    this.$uploadTip.hide();
};

UploadImage.prototype.showFile = function(file){
    //var self = this;
    this.file = file;
    this.$uploadBtn.hide();
    this.$uploadTip.html('正在上传: ' + file.name).show();
    this.hideError();
};

UploadImage.prototype.showError = function(error){
    this.$upload.find('.alert-error').html(error).show();
};

UploadImage.prototype.hideError = function(error){
    this.$upload.find('.alert-error').hide();
};

UploadImage.prototype.showProgress = function(file, percentage){
    this.$uploadTip
        .html('正在上传: ' + file.name + ' ' + percentage + '%')
        .show();
};

UploadImage.prototype.show = function(){
    this.$win.modal('show');
};

global.UploadImage = UploadImage;

})(this);
