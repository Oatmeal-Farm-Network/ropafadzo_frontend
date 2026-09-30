  <% Current = "Classes" %>
   <!--#Include File ="HeaderTabsInclude.asp"--> 
   <table cellpadding = "0" cellspacing = "0" border = "0" width = "100%" height = "34" background = "images/SelectedHeader.jpg">
   <tr>
   	    <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
   <td ><img src = "images/px.gif" width = "10" height = "1" >
    	<a href = "ClassesHome.asp?EventID=<%=eventID%>" class = "menu2">Classes Overview</a> |
 	 	<a href = "ClassesAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Classes</a> |&nbsp; 
		<a href = "ClassesEditDetails.asp?EventID=<%=EventID%>#Edit" class = "menu2">Edit Classes</a> |&nbsp; 
		<a href = "ClassesPhotos.asp?EventID=<%=EventID%>#Edit" class = "menu2">Photos</a> 
	<% showstudents= false
	if showstudents= true then
	 %>	
		|&nbsp;
    	<a href = "StudentsAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Students</a> | 
  	 	<a href = "StudentsEdit.asp?EventID=<%=EventID%>" class = "menu2">Edit Students</a>
  	 <% end if %>
	  </td>
	 <td align = "right">
	 	   <!--#Include File ="RightmenuInclude.asp"--> 
	 </td>
	    <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
	</tr>
</table>

   <!--#Include File ="HeaderTabsIncludeBottom.asp"--> 
