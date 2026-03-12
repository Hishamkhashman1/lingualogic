class ApplicationController < ActionController::Base
  before_action :set_locale

  def after_sign_out_path_for(resource_or_scope)
    new_student_session_path
  end

  private

  def set_locale
    locale = params[:locale]&.to_sym
    if locale && I18n.available_locales.include?(locale)
      session[:locale] = locale
    end
    I18n.locale = session[:locale] || I18n.default_locale
  end

  def default_url_options
    { locale: I18n.locale }
  end
end
