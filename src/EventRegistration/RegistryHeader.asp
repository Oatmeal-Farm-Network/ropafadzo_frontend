<table width = "500" align = "right">
   <tr>
		<td><a href = "RegList.asp" class = "menu">View Your Registry</a> |</td>
		<td><a href = "RegManageHome.asp" class = "menu">Add To Your Registry</a> |</td>
		<td><a href = "regAccountInfo.asp" class = "menu">Your Information</a> |</td>
		<td><a href = "RegistryHome.asp" class = "menu">Sign Off</a></td>
	</tr>
	<tr>
	   <td class = "body">
	   <% If PageName = "Registry Search Results" then%>
			<a href ="Registryhome.asp" class = "body">Registry Home Page</a> > <a href ="RegistrySearch.asp" class = "body">Registry Search Results</a>
		<% End If %>
 <% If pagename = "Reg List View" then%>
			<a href ="Registryhome.asp" class = "body">Registry Home Page</a> > <a href ="RegistrySearch.asp" class = "body">Registry Search Results</a> > <a href ="RegListview.asp?EventID=<" class = "body">Registry Search Results</a>
		<% End If %>

		
	   </td>
	  </tr>
</table>
<br><br>
