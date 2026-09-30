   <% Current = "Vendors" %>
   <!--#Include File ="HeaderTabsInclude.asp"--> 
   <table cellpadding = "0" cellspacing = "0" border = "0" width = "100%" height = "34" background = "images/SelectedHeader.jpg">
   <tr>
       <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
   <td ><img src = "images/px.gif" width = "20" height = "1" >
    	<a href = "VendorsHome.asp?EventID=<%=eventID%>" class = "menu2">Vendors Overview</a> |
 <a href = "Vendorspagedata.asp?EventID=<%=eventID%>" class = "menu2">Add Vendor Options</a> |
     <a href = "VendorsEditPageData.asp?EventID=<%=eventID%>#VendorOptions" class = "menu2">Edit Vendor Options</a>
     <% showaddvendors  = False
     if  showaddvendors  = True then %>
      |
 	 <a href = "VendorAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Vendors</a> |&nbsp; 
 	 <a href = "VendorEdit.asp?EventID=<%=eventID%>" class = "menu2">Edit Vendors</a>
 	 <% end if %> 
	  </td>
	 <td align = "right">
	 	   <!--#Include File ="RightmenuInclude.asp"--> 
	 </td>
	    <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
	</tr>
</table>

   <!--#Include File ="HeaderTabsIncludeBottom.asp"--> 
