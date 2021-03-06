/**
 * Created by exoplatform on 08/01/15.
 */
(function($){

  var _popupConfirmation;
  var _reason;

  var _messageConfirmCBController = function (type,message) {
    var alertDOM =  $('#JuzRemoveAccountAlertContainer');
    if(type != null && type != "") {
      var icon = type.charAt(0).toUpperCase() + type.slice(1);
      var strIcon = "<i class='uiIcon" + icon + "'></i>";
      alertDOM.removeClass();
      alertDOM.addClass('alert');
      alertDOM.addClass('alert-' + type);
      alertDOM.html(strIcon + message);
      alertDOM.css('visibility', 'visible');
      setTimeout(function() {
        alertDOM.css("visibility" , "hidden");
      }, 5000);
    }
  };
  var _displayLoading = function(b){
    var loadingDOM = $('#JuzRemoveAccountAjaxLoadingMask');
    if(loadingDOM.length > 0){
      if(b)
        loadingDOM.show();
      else
        loadingDOM.hide();
    }
  };
  var _disPlayInfoMsgCB = function(msg){
    _messageConfirmCBController('info',msg);
  };
  var _disPlaySuccessMsgCB = function(msg){
    _messageConfirmCBController('success',msg);
  };
  var _disPlayWarningMsgCB = function(msg){
    _messageConfirmCBController('warning',msg);
  };
  var _disPlayErrorMsgCB = function(msg){
    _messageConfirmCBController('error',msg);
  };

  function _doRemoveMyAccount(){
    if (typeof _reason == "undefined"){
      _disPlayInfoMsgCB("Please precise the reason");
      return;
    }
    _displayLoading(true);
    if (_reason == ""){
      _reason = "Other";
    }
    _popupConfirmation.hide();
    var unSubscribeMktEmail = "0";
    if($(".remove-account-unsubscribe-mkt-email").prop("checked"))
      unSubscribeMktEmail = "1";
    $('.jz').jzAjax('JuZFrontendApplication.doRemoveMyAccount()',{
      data:{reason:_reason,unSubscribeMktEmail:unSubscribeMktEmail},
      success:function(data){
        _displayLoading(false);
        if(data != 'nok'){
          window.location.href = "http://"+window.location.host+"/portal/intranet/remove-account-success";
        }else{
          _disPlayErrorMsgCB("Something went wrong, cannot remove your account");
        }
      }
    });
  }
  $(document).ready(function () {
    // tmp for ORG-1337 need to remove will have mkto plugin
    if($("#juzUnsubscribeMktEmailContainer").length > 0){
      $("#juzUnsubscribeMktEmailContainer").hide();
    }
    _popupConfirmation = $("#removeAccountConfirmPopupContainer");

    $(document).on('click.remove-my-account.btn','button.remove-account-btn',function(){
      if (typeof _reason == "undefined"){
        _disPlayInfoMsgCB("Please precise the reason");
        return;
      }
      _popupConfirmation.show();
    });

    $(document).on('click.remove-my-account-confirm-yes','a.btn-remove-account-Confirm-Yes',function(){
      if(_reason == 5){
        _reason = $("#reasonOther").val();
      }
      _doRemoveMyAccount();
    });

    $(document).on('click.remove-my-account-confirm-no','a.btn-remove-account-Confirm-No,a.removeAccountConfirmPopupClose', function () {
      _popupConfirmation.hide();
    });
    $(document).on('click.remove-account-reason','input:radio.remove-account-reason',function(){
      _reason = $(this).val();
    });
    $(document).on('focus.txt.other.reason','input:text#reasonOther',function(){
      var parent = $(this).parents(".uiRadio");
      if(null != parent && typeof parent != "undefined"){
        parent.children(".remove-account-reason").prop("checked",true);
        _reason = 5;
      }
    });
    $(document).on('click.remove-my-account.unsubscribe-mkto-email','input:checkbox.remove-account-unsubscribe-mkt-email',function(){
      try{
        if ($("input:checkbox.chkboxUnsubscribeMktEmail").length > 0){
          $("input:checkbox.chkboxUnsubscribeMktEmail").trigger("click");
        }
      } catch (e){console.info("cannot trigger to unsubscribe mkto portlet")}
    });
  });
})($);
