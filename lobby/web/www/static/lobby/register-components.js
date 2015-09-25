define([
        "knockout",
        "components/menu-component/main",
        "components/error-panel/main",
        "components/page-panel/main"
        ],
        function(
        		ko,
        		menu_component,
                        error_panel,
                        page_panel){
	
	ko.components.register("menu-component",menu_component);
        ko.components.register("error-panel",error_panel);
        ko.components.register("page-panel",page_panel);
	
});