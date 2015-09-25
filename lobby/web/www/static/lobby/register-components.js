define([
        "knockout",
        "components/menu-component/main",
        "components/error-panel/main",
        "components/change-password/main",
        "components/profile-panel/main",
        "components/page-panel/main",
        "components/lobby-panel/main",
        "components/utils/main"
        ],
        function(
		ko,
		menu_component,
                error_panel,
                change_password,
                profile_panel,
                page_panel,
                lobby_panel){

	      ko.components.register("menu-component",menu_component);
        ko.components.register("error-panel",error_panel);
        ko.components.register("change-password",change_password);
        ko.components.register("profile-panel",profile_panel);
        ko.components.register("page-panel",page_panel);
        ko.components.register("lobby-panel",lobby_panel);

});
