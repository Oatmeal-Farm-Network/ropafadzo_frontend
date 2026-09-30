<table  width = "100%">
		<tr>
	   <td class = "body" colspan = "5" align = "right"> 
	   <% If PageName = "Registry Search Results" then%>
			<a href ="Default.asp" class = "body">Home Page</a> > <a href ="RegistrySearch.asp" class = "body">Event Search Results</a>
		<% End If %>
		<% If pagename = "Reg List View" then%>
			<a href ="Default.asp" class = "body">Home Page</a> > <a href ="RegistrySearch.asp" class = "body">Event Search Results</a> > <a href ="RegListview.asp?EventID=<%=EventID %>" class = "body">Event Listing</a>
		<% End If %>

		<% If pagename = "Reg Product Details"  then%>
			<a href ="Default.asp" class = "body">Home Page</a> > <a href ="RegistrySearch.asp" class = "body">Event Search Results</a> > <a href ="RegListview.asp?EventID=<%=EventID %>" class = "body">Event Listing</a> > <a href ="RegProductDetails.asp?prodid=<%=prodid %>" class = "body"><%=prodname%></a>
		<% End If %>
	   </td>
	  </tr>
</table>
