
   <% Current = "Advertising" %>
   <!--#Include virtual="HeaderTabsInclude.asp"--> 
   <table cellpadding = "0" cellspacing = "0" border = "0" width = "100%" height = "34" background = "images/SelectedHeader.jpg">
   <tr>
     <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
   <td ><img src = "images/px.gif" width = "20" height = "1" >
	 <a href = "AdvertisingHome.asp?EventID=<%=EventID%>" class = "menu2">Advertising Overview</a> | 
	 <a href = "AdvertisingsAddOptions.asp?EventID=<%=EventID%>" class = "menu2">Add Advertising Options</a> | 
	 <a href = "AdvertisingEditPageData.asp?EventID=<%=EventID%>#Options" class = "menu2">Edit Advertising Options</a> 
	 <% showadvertisers = false
	   if showadvertisers = true then
	  %>
	 | 
	 	 <a href = "AdvertisingAdd.asp?EventID=<%=EventID%>#Options" class = "menu2">Add Advertiser</a>  | 	 
	 	 <a href = "AdvertisingEdit.asp?EventID=<%=EventID%>#Options" class = "menu2">Edit Advertisers</a>
	 	<% end if %>
	  </td>
	 <td align = "right">
	 	   <!--#Include virtual="RightmenuInclude.asp"--> 
	 </td>
	    <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
	</tr>
</table>

   <!--#Include virtual="HeaderTabsIncludeBottom.asp"--> 
