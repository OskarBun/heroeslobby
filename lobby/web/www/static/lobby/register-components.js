define([
        "knockout",
        "components/menu-component/main",
        "components/page-panel/main"
        ],
        function(
        		ko,
        		menu_component,
        		page_panel){
	
	ko.components.register("menu-component",menu_component);
	ko.components.register("page-panel",page_panel);
	
});